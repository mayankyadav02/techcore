# Testing Guide

## Framework
TechCore uses the native **Node.js test runner** (`node:test`) combined with `tsx` for TypeScript execution. This avoids the overhead of Jest or Vitest while providing a fast, built-in testing environment.

## Test Commands
- **Run all tests**: `npm run test`
- **Linting**: `npm run lint`
- **Typechecking**: `npm run typecheck`

## Test Structure
Tests are located in the `tests/` directory.

### Covered Areas
- **Validation**: `tests/validation.test.ts`
- **Authentication**: `tests/auth.test.ts`, `tests/password-reset.test.ts`
- **Public Routes & Sync**: `tests/public-content.test.ts`, `tests/public-sync.test.ts`, `tests/routes.test.ts`
- **Media**: `tests/media-upload.test.ts`, `tests/media-delete.test.ts`
- **Email**: `tests/email.test.ts`
- **Search**: `tests/search.test.ts`
- **Users**: `tests/users.test.ts`
- **Security & Sanitization**: `tests/sanitize.test.ts`
- **SEO/OG**: `tests/og.test.ts`
- **Audit Logging**: `tests/audit-format.test.ts`

## Requirements
Running tests requires a local MongoDB instance. The test suite handles creating isolated test data and cleaning up after execution.
