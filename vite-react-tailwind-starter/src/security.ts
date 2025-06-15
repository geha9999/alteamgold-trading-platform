/**
 * Security utilities and best practices for the app
 */

export function validateEmail(email: string): boolean {
  const re = /^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/;
  return re.test(password);
}

export function sanitizeInput(input: string): string {
  // Basic sanitization to prevent XSS
  return input.replace(/[&<>"'`=\\/]/g, (s) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;',
      '=': '&#x3D;',
      '\\': '&#x5C;',
    };
    return map[s];
  });
}
