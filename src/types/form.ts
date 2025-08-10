export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface DerivedField {
  parentFields: string[];
  formula: string; // Simple formula like "field1 + field2" or for age: "new Date().getFullYear() - new Date(dateOfBirth).getFullYear()"
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules: ValidationRule[];
  options?: FieldOption[]; // For select, radio, checkbox
  isDerived?: boolean;
  derivedConfig?: DerivedField;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}