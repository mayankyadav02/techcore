import "./load-env";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { NextRequest } from "next/server";
import { POST as postLogin } from "@/app/api/auth/login/route";
import { POST as postLogout } from "@/app/api/auth/logout/route";
import { GET as getSession } from "@/app/api/auth/session/route";
import { GET as getDashboard } from "@/app/api/admin/dashboard/route";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { hashPassword } from "@/modules/identity/password";
import { User } from "@/modules/identity/user.model";
import { Session } from "@/modules/identity/session.model";
import {
  createSessionToken,
  hashSessionToken,
} from "@/modules/identity/session.service";
import { connectMongo, disconnectMongo } from "@/lib/db";
import { proxy } from "@/proxy";

const password = "correct-horse-battery";
const email = `auth.${Date.now()}@techcore.example`;

function request(url: string, init?: RequestInit) {
  return new Request(url, init);
}

function cookieHeader(response: Response) {
  const header = response.headers.get("set-cookie") ?? "";
  const match = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

describe("admin authentication", () => {
  before(async () => {
    await connectMongo();
    await User.create({
      email,
      name: "Auth Tester",
      passwordHash: await hashPassword(password),
      role: "admin",
      status: "active",
    });
  });

  it("rejects invalid credentials without leaking details", async () => {
    const response = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password: "definitely-wrong-pass",
        }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      message?: string;
      code?: string;
    };
    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.code, "UNAUTHORIZED");
    assert.equal(body.message, "Invalid credentials.");
  });

  it("rejects a missing password", async () => {
    const response = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      }),
    );
    assert.equal(response.status, 400);
  });

  it("signs in with valid credentials and sets an httpOnly cookie", async () => {
    const response = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      data?: { email?: string; role?: string; token?: string };
    };
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data?.email, email);
    assert.equal(body.data?.token, undefined);
    const token = cookieHeader(response);
    assert.ok(token);
    const setCookie = response.headers.get("set-cookie") ?? "";
    assert.match(setCookie, /httponly/i);
    assert.doesNotMatch(setCookie, /password/i);
  });

  it("returns the current session for a valid cookie", async () => {
    const login = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );
    const token = cookieHeader(login);
    const response = await getSession(
      request("http://localhost/api/auth/session", {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      data?: { user?: { email?: string } };
    };
    assert.equal(response.status, 200);
    assert.equal(body.data?.user?.email, email);
  });

  it("rejects dashboard access without a session", async () => {
    const response = await getDashboard(
      request("http://localhost/api/admin/dashboard"),
    );
    const body = (await response.json()) as { success: boolean; code?: string };
    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.code, "UNAUTHORIZED");
  });

  it("allows dashboard access with a valid session", async () => {
    const login = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );
    const token = cookieHeader(login);
    const response = await getDashboard(
      request("http://localhost/api/admin/dashboard", {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      data?: { counts?: { services?: number } };
    };
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(typeof body.data?.counts?.services, "number");
  });

  it("destroys the session on logout", async () => {
    const login = await postLogin(
      request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
    );
    const token = cookieHeader(login);
    const logout = await postLogout(
      request("http://localhost/api/auth/logout", {
        method: "POST",
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }),
    );
    assert.equal(logout.status, 200);
    const session = await getSession(
      request("http://localhost/api/auth/session", {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }),
    );
    assert.equal(session.status, 401);
  });

  it("rejects an expired session", async () => {
    const user = await User.findOne({ email });
    assert.ok(user);
    const token = createSessionToken();
    await Session.create({
      userId: user._id,
      tokenHash: hashSessionToken(token),
      expiresAt: new Date(Date.now() - 1000),
      lastSeenAt: new Date(Date.now() - 1000),
    });
    const response = await getSession(
      request("http://localhost/api/auth/session", {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }),
    );
    assert.equal(response.status, 401);
  });

  it("redirects unauthenticated admin page requests to login", () => {
    const response = proxy(
      new NextRequest("http://localhost/admin/dashboard"),
    );
    assert.equal(response.status, 307);
    assert.match(response.headers.get("location") ?? "", /\/admin\/login/);
  });

  it("blocks unauthenticated admin API requests in the proxy", () => {
    const response = proxy(
      new NextRequest("http://localhost/api/admin/dashboard"),
    );
    assert.equal(response.status, 401);
  });

  after(async () => {
    await User.deleteOne({ email });
    await disconnectMongo();
  });
});
