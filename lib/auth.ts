/**
 * Identity is implemented in a later phase.
 * Server Actions and admin loaders must call requireUser() once sessions exist.
 */
export async function getSession(): Promise<null> {
  return null;
}

export async function requireUser(): Promise<never> {
  throw new Error("Authentication is not implemented in this phase.");
}
