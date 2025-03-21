export const generateSecurePassword = (length = 12): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure at least one character from each category
  let password = 
    getRandomChar(uppercaseChars) +
    getRandomChar(lowercaseChars) +
    getRandomChar(numberChars) +
    getRandomChar(specialChars);
  
  // Fill the rest of the password with random characters
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password to avoid predictable patterns
  return shuffleString(password);
};

const getRandomChar = (characters: string): string => {
  return characters.charAt(Math.floor(Math.random() * characters.length));
};

const shuffleString = (str: string): string => {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
};

export const validatePassword = (password: string, policy: {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < policy.minLength) {
    errors.push(`La contraseña debe tener al menos ${policy.minLength} caracteres.`);
  }
  
  // Check for uppercase letters
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula.');
  }
  
  // Check for lowercase letters
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula.');
  }
  
  // Check for numbers
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número.');
  }
  
  // Check for special characters
  if (policy.requireSpecialChars && !/[!@#$%^&*()_\-+=<>?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial.');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  // In a real application, you would use a proper password hashing library
  // This is just a simple example using the Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};