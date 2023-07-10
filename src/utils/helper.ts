export function generateOTP(length: number): number {
  return Math.floor(100000 + Math.random() * 900000);
}
