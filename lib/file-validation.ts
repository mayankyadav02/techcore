export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export async function validateImageContent(buffer: Buffer): Promise<boolean> {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WebP: RIFF ... WEBP
  // 'R' = 0x52, 'I' = 0x49, 'F' = 0x46, 'F' = 0x46
  // 'W' = 0x57, 'E' = 0x45, 'B' = 0x42, 'P' = 0x50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  // AVIF: starts with 'ftyp' somewhere in first 12 bytes or similar
  // usually: 00 00 00 xx 66 74 79 70 61 76 69 66  (....ftypavif)
  if (
    buffer[4] === 0x66 && // f
    buffer[5] === 0x74 && // t
    buffer[6] === 0x79 && // y
    buffer[7] === 0x70 && // p
    buffer[8] === 0x61 && // a
    buffer[9] === 0x76 && // v
    buffer[10] === 0x69 && // i
    buffer[11] === 0x66    // f
  ) {
    return true;
  }

  return false;
}
