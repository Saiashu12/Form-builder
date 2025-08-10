import { ValidationRule } from '../types/form.ts';

export const validateField = (value: any, rules: ValidationRule[]): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message);
        }
        break;
      
      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
      
      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
      
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
      
      case 'password':
        if (value && typeof value === 'string') {
          if (value.length < 8 || !/\d/.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
    }
  }

  return errors;
};

export const calculateDerivedValue = (formula: string, formData: Record<string, any>): any => {
  try {
    // Simple formula evaluation - in production, you'd want a more robust solution
    // For age calculation from date of birth
    if (formula.includes('new Date().getFullYear() - new Date(') && formula.includes(').getFullYear()')) {
      const fieldName = formula.match(/new Date\((\w+)\)/)?.[1];
      if (fieldName && formData[fieldName]) {
        const birthDate = new Date(formData[fieldName]);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
    }
    
    // Simple arithmetic operations
    let evaluatedFormula = formula;
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (typeof value === 'number') {
        evaluatedFormula = evaluatedFormula.replace(new RegExp(key, 'g'), value.toString());
      }
    });
    
    // Basic arithmetic evaluation (be careful with eval in production)
    if (/^[\d\s+\-*/().]+$/.test(evaluatedFormula)) {
      return eval(evaluatedFormula);
    }
    
    return '';
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return '';
  }
};