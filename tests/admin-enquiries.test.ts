import { test, describe, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import "./load-env";

import { connectMongo, disconnectMongo } from "@/lib/db";
import { User } from "@/modules/identity/user.model";
import { Session } from "@/modules/identity/session.model";
import { createSessionToken, hashSessionToken } from "@/modules/identity/session.service";
import { Enquiry } from "@/modules/leads/enquiry.model";
import {
  listEnquiries,
  getEnquiry,
  setEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry
} from "@/modules/leads/admin.service";

describe("Admin Enquiries (Phase 19)", () => {
  let adminId: string;
  let viewerId: string;
  let adminToken: string;
  let viewerToken: string;

  let contactEnquiryId: string;
  let quoteEnquiryId: string;

  before(async () => {
    await connectMongo();
    await User.deleteMany({ email: { $in: ["admin-leads@test.com", "viewer-leads@test.com"] } });
    await Enquiry.deleteMany({ email: { $in: ["contact-lead@test.com", "quote-lead@test.com"] } });

    const adminUser = await User.create({
      name: "Leads Admin",
      email: "admin-leads@test.com",
      passwordHash: "test",
      role: "admin",
    });
    adminId = String(adminUser._id);
    adminToken = createSessionToken();
    await Session.create({
      userId: adminId,
      tokenHash: hashSessionToken(adminToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      lastSeenAt: new Date()
    });

    const viewerUser = await User.create({
      name: "Leads Viewer",
      email: "viewer-leads@test.com",
      passwordHash: "test",
      role: "viewer",
    });
    viewerId = String(viewerUser._id);
    viewerToken = createSessionToken();
    await Session.create({
      userId: viewerId,
      tokenHash: hashSessionToken(viewerToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      lastSeenAt: new Date()
    });

    const contact = await Enquiry.create({
      type: "contact",
      name: "Alice Contact",
      email: "contact-lead@test.com",
      message: "Hello from contact",
      status: "new",
    });
    contactEnquiryId = String(contact._id);

    const quote = await Enquiry.create({
      type: "quote",
      name: "Bob Quote",
      email: "quote-lead@test.com",
      message: "Hello from quote",
      status: "contacted",
    });
    quoteEnquiryId = String(quote._id);
  });

  after(async () => {
    await User.deleteMany({ email: { $in: ["admin-leads@test.com", "viewer-leads@test.com"] } });
    await Enquiry.deleteMany({ email: { $in: ["contact-lead@test.com", "quote-lead@test.com"] } });
    await disconnectMongo();
  });

  function mockCookies(token?: string) {
    const cache = require("next/cache");
    mock.method(cache, "revalidatePath", () => {});
    const headers = require("next/headers");
    mock.method(headers, "cookies", () => ({
      get: () => (token ? { value: token } : undefined),
      set: () => {},
      delete: () => {},
    }));
  }

  describe("listEnquiries", () => {
    test("authorized user can list enquiries", async () => {
      mockCookies(adminToken);
      const res = await listEnquiries({});
      assert.ok(Array.isArray(res.rows));
      assert.ok(res.total >= 2);

      const alice = res.rows.find((r) => r.email === "contact-lead@test.com");
      assert.ok(alice);
      assert.strictEqual(alice.type, "contact");
    });

    test("authorized user can filter by type", async () => {
      mockCookies(adminToken);
      const res = await listEnquiries({ type: "quote" });
      const containsContact = res.rows.some((r) => r.type === "contact");
      const containsQuote = res.rows.some((r) => r.type === "quote");
      assert.strictEqual(containsContact, false);
      assert.strictEqual(containsQuote, true);
    });

    test("authorized user can filter by status", async () => {
      mockCookies(adminToken);
      const res = await listEnquiries({ status: "contacted" });
      const containsNew = res.rows.some((r) => r.status === "new");
      const containsContacted = res.rows.some((r) => r.status === "contacted");
      assert.strictEqual(containsNew, false);
      assert.strictEqual(containsContacted, true);
    });

    test("unauthorized user is rejected", async () => {
      mockCookies(viewerToken);
      await assert.rejects(listEnquiries({}), /You do not have access/);
    });
  });

  describe("getEnquiry", () => {
    test("authorized user can get enquiry details", async () => {
      mockCookies(adminToken);
      const res = await getEnquiry(contactEnquiryId);
      assert.strictEqual(res.name, "Alice Contact");
      assert.strictEqual(res.email, "contact-lead@test.com");
    });

    test("unauthorized user is rejected", async () => {
      mockCookies(viewerToken);
      await assert.rejects(getEnquiry(contactEnquiryId), /You do not have access/);
    });
  });

  describe("setEnquiryStatus", () => {
    test("authorized user can change to a valid status", async () => {
      mockCookies(adminToken);
      // 'new' -> 'closed' is valid for contact
      await setEnquiryStatus(contactEnquiryId, { status: "closed" });

      const updated = await Enquiry.findById(contactEnquiryId);
      assert.strictEqual(updated?.status, "closed");
    });

    test("authorized user cannot change to an invalid status", async () => {
      mockCookies(adminToken);
      // 'closed' -> 'new' is invalid
      await assert.rejects(
        setEnquiryStatus(contactEnquiryId, { status: "new" }),
        /That status change is not allowed/
      );

      const updated = await Enquiry.findById(contactEnquiryId);
      assert.strictEqual(updated?.status, "closed"); // unchanged
    });

    test("unauthorized user is rejected", async () => {
      mockCookies(viewerToken);
      await assert.rejects(
        setEnquiryStatus(quoteEnquiryId, { status: "qualified" }),
        /You do not have access/
      );
    });
  });

  describe("addEnquiryNote", () => {
    test("authorized user can add an internal note", async () => {
      mockCookies(adminToken);
      await addEnquiryNote(contactEnquiryId, { body: "This is a test note" });

      const updated = await Enquiry.findById(contactEnquiryId);
      assert.strictEqual(updated?.notes.length, 1);
      assert.strictEqual(updated?.notes[0].body, "This is a test note");
      assert.strictEqual(String(updated?.notes[0].authorId), adminId);
    });

    test("unauthorized user is rejected", async () => {
      mockCookies(viewerToken);
      await assert.rejects(
        addEnquiryNote(contactEnquiryId, { body: "Rogue note" }),
        /You do not have access/
      );
    });
  });

  describe("deleteEnquiry", () => {
    test("unauthorized user is rejected", async () => {
      mockCookies(viewerToken);
      await assert.rejects(deleteEnquiry(quoteEnquiryId), /You do not have access/);
    });

    test("authorized user can soft-delete an enquiry", async () => {
      mockCookies(adminToken);
      await deleteEnquiry(quoteEnquiryId);

      const updated = await Enquiry.findById(quoteEnquiryId);
      assert.ok(updated?.deletedAt !== null);

      // Should not appear in listEnquiries anymore
      const res = await listEnquiries({});
      const found = res.rows.find((r) => r.id === quoteEnquiryId);
      assert.strictEqual(found, undefined);
    });
  });
});
