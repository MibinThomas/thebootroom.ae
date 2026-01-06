/**
 * Generate a unique identifier consisting of random and timestamp components.
 * While Prisma automatically generates UUIDs for our database records, this helper
 * can be used for other purposes such as file names.
 */
export function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}