import { useState } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: unknown) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  },
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
  },
  amount: {
    required: true,
    min: 1,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
};

export const validateField = (value: unknown, rules: ValidationRule): string | null => {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  if (!value) return null;

  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    if (rules.pattern === validationRules.email.pattern) {
      return 'Please enter a valid email address';
    }
    if (rules.pattern === validationRules.pan.pattern) {
      return 'Please enter a valid PAN (e.g., ABCDE1234F)';
    }
    if (rules.pattern === validationRules.phone.pattern) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return 'Invalid format';
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    return `Minimum value is ${rules.min}`;
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    return `Maximum value is ${rules.max}`;
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (
  data: Record<string, unknown>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const useFormValidation = (
  initialData: Record<string, unknown>,
  rules: Record<string, ValidationRule>
) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateFieldLocal = (field: string, value: unknown) => {
    const rule = rules[field];
    if (!rule) return null;
    
    return validateField(value, rule);
  };

  const handleChange = (field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateFieldLocal(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateFieldLocal(field, data[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  const validateAll = () => {
    const result = validateForm(data, rules);
    setErrors(result.errors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return result.isValid;
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).every(key => !errors[key])
  };
};
