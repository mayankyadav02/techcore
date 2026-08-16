import bcrypt from "bcryptjs";
import { BCRYPT_COST } from "@/lib/auth-constants";

const dummyHash =
  "$2b$12$FYAjndJwK2xFHM8aNXqPfefTp4I533Qiwrpl.XRyhTMb0seTDBcFK";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword(password: string, passwordHash?: string) {
  const hash = passwordHash && passwordHash.length > 0 ? passwordHash : dummyHash;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
