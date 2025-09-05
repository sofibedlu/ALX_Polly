// Validation utility functions

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isValidPollTitle(title: string): boolean {
  return title.trim().length >= 3 && title.trim().length <= 200;
}

export function isValidPollDescription(description: string): boolean {
  return description.length <= 1000;
}

export function isValidPollOption(option: string): boolean {
  return option.trim().length >= 1 && option.trim().length <= 100;
}

export function validatePollData(data: {
  title: string;
  description?: string;
  options: string[];
}): {
  isValid: boolean;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};

  // Validate title
  if (!isValidPollTitle(data.title)) {
    errors.title = ['Title must be between 3 and 200 characters'];
  }

  // Validate description
  if (data.description && !isValidPollDescription(data.description)) {
    errors.description = ['Description must be less than 1000 characters'];
  }

  // Validate options
  if (data.options.length < 2) {
    errors.options = ['At least 2 options are required'];
  } else if (data.options.length > 10) {
    errors.options = ['Maximum 10 options allowed'];
  } else {
    const optionErrors: string[] = [];
    data.options.forEach((option, index) => {
      if (!isValidPollOption(option)) {
        optionErrors.push(`Option ${index + 1} must be between 1 and 100 characters`);
      }
    });
    if (optionErrors.length > 0) {
      errors.options = optionErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function isFutureDate(date: string): boolean {
  const d = new Date(date);
  const now = new Date();
  return d > now;
}
