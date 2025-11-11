/**
 * Validation and sanitization utilities for API endpoints
 */

// Basic HTML tag whitelist for allowed formatting
const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_ATTRIBUTES: string[] = [];

/**
 * Sanitizes HTML content by removing dangerous tags and attributes
 * This is a basic sanitization - for production, consider using DOMPurify
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers like onclick, onerror, etc.
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data URIs
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ''); // Remove style tags

  // Only allow specific tags
  const tagPattern = new RegExp(`<(?!\/?(${ALLOWED_TAGS.join('|')})\\b)[^>]+>`, 'gi');
  sanitized = sanitized.replace(tagPattern, '');

  return sanitized.trim();
}

/**
 * Strips all HTML tags and returns plain text
 * Useful for displaying user input as plain text (e.g., job titles)
 */
export function stripHTMLTags(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // First sanitize to remove dangerous content
  let sanitized = sanitizeHTML(input);
  
  // Then remove all remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = sanitized;
    sanitized = textarea.value;
  } else {
    // Fallback for server-side: basic entity decoding
    sanitized = sanitized
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
  
  return sanitized.trim();
}

/**
 * Validates and sanitizes string input
 */
export function validateString(input: any, fieldName: string, options: {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  allowHTML?: boolean;
} = {}): { isValid: boolean; value: string; error?: string } {
  const { required = false, maxLength, minLength, allowHTML = false } = options;

  // Check if required
  if (required && (!input || (typeof input === 'string' && input.trim().length === 0))) {
    return { isValid: false, value: '', error: `${fieldName} is required` };
  }

  // Convert to string if not already
  let value = input != null ? String(input) : '';

  // Sanitize HTML if not allowed
  if (!allowHTML && value) {
    value = sanitizeHTML(value);
  } else if (allowHTML && value) {
    // Even if HTML is allowed, sanitize dangerous content
    value = sanitizeHTML(value);
  }

  // Check length constraints
  if (minLength !== undefined && value.length < minLength) {
    return { isValid: false, value, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return { isValid: false, value, error: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { isValid: true, value };
}

/**
 * Validates number input
 */
export function validateNumber(input: any, fieldName: string, options: {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
} = {}): { isValid: boolean; value: number | null; error?: string } {
  const { required = false, min, max, integer = false } = options;

  // Check if required
  if (required && (input === null || input === undefined || input === '')) {
    return { isValid: false, value: null, error: `${fieldName} is required` };
  }

  // Allow null/undefined if not required
  if (input === null || input === undefined || input === '') {
    return { isValid: true, value: null };
  }

  // Convert to number
  const num = Number(input);

  // Check if valid number
  if (isNaN(num)) {
    return { isValid: false, value: null, error: `${fieldName} must be a valid number` };
  }

  // Check if integer
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, value: null, error: `${fieldName} must be an integer` };
  }

  // Check min/max
  if (min !== undefined && num < min) {
    return { isValid: false, value: null, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, value: null, error: `${fieldName} must not exceed ${max}` };
  }

  return { isValid: true, value: num };
}

/**
 * Validates boolean input
 */
export function validateBoolean(input: any, fieldName: string, defaultValue: boolean = false): boolean {
  if (typeof input === 'boolean') {
    return input;
  }
  if (input === 'true' || input === 1 || input === '1') {
    return true;
  }
  if (input === 'false' || input === 0 || input === '0') {
    return false;
  }
  return defaultValue;
}

/**
 * Validates array input
 */
export function validateArray(input: any, fieldName: string, options: {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
} = {}): { isValid: boolean; value: any[]; error?: string } {
  const { required = false, maxLength, minLength } = options;

  // Check if required
  if (required && (!input || !Array.isArray(input))) {
    return { isValid: false, value: [], error: `${fieldName} must be an array` };
  }

  // Allow empty array if not required
  if (!input || !Array.isArray(input)) {
    return { isValid: true, value: [] };
  }

  // Check length constraints
  if (minLength !== undefined && input.length < minLength) {
    return { isValid: false, value: input, error: `${fieldName} must have at least ${minLength} items` };
  }

  if (maxLength !== undefined && input.length > maxLength) {
    return { isValid: false, value: input, error: `${fieldName} must not exceed ${maxLength} items` };
  }

  return { isValid: true, value: input };
}

/**
 * Validates ObjectId format
 */
export function validateObjectId(input: any, fieldName: string, required: boolean = true): { isValid: boolean; value: string | null; error?: string } {
  if (required && (!input || typeof input !== 'string')) {
    return { isValid: false, value: null, error: `${fieldName} is required and must be a string` };
  }

  if (!input) {
    return { isValid: true, value: null };
  }

  // MongoDB ObjectId is 24 hex characters
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(input)) {
    return { isValid: false, value: null, error: `${fieldName} must be a valid ObjectId` };
  }

  return { isValid: true, value: input };
}

/**
 * Validates email format
 */
export function validateEmail(input: any, fieldName: string, required: boolean = false): { isValid: boolean; value: string | null; error?: string } {
  if (required && (!input || typeof input !== 'string')) {
    return { isValid: false, value: null, error: `${fieldName} is required` };
  }

  if (!input) {
    return { isValid: true, value: null };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input)) {
    return { isValid: false, value: null, error: `${fieldName} must be a valid email address` };
  }

  return { isValid: true, value: input };
}

/**
 * Validates user object structure
 */
export function validateUserObject(user: any, fieldName: string): { isValid: boolean; value: any; error?: string } {
  if (!user || typeof user !== 'object') {
    return { isValid: false, value: null, error: `${fieldName} must be an object` };
  }

  const sanitized: any = {};

  // Validate and sanitize name
  if (user.name) {
    const nameValidation = validateString(user.name, 'name', { maxLength: 200 });
    if (!nameValidation.isValid) {
      return { isValid: false, value: null, error: nameValidation.error };
    }
    sanitized.name = nameValidation.value;
  }

  // Validate and sanitize email
  if (user.email) {
    const emailValidation = validateEmail(user.email, 'email');
    if (!emailValidation.isValid) {
      return { isValid: false, value: null, error: emailValidation.error };
    }
    sanitized.email = emailValidation.value;
  }

  // Validate and sanitize image URL
  if (user.image) {
    const imageValidation = validateString(user.image, 'image', { maxLength: 500 });
    if (!imageValidation.isValid) {
      return { isValid: false, value: null, error: imageValidation.error };
    }
    sanitized.image = imageValidation.value;
  }

  return { isValid: true, value: sanitized };
}

