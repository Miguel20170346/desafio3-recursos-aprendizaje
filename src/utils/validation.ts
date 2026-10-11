import { PasswordRulesResult } from '../types';

/**
 * Reglas de validación de contraseñas según la guía:
 * • Mínimo 12 caracteres.
 * • Al menos una letra mayúscula.
 * • Al menos una letra minúscula.
 * • Al menos un número.
 * • Al menos un carácter especial (! @#$%^&*).
 */
export const checkPasswordRules = (password: string = ''): PasswordRulesResult => {
  const minLength = password.length >= 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const isValid = minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  return {
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecial,
    isValid,
  };
};

export const validateEmail = (email: string = ''): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateUrl = (url: string = ''): boolean => {
  try {
    const trimmed = url.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://');
  } catch {
    return false;
  }
};
