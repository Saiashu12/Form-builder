import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormSchema, FormField, FormData } from '../types/form.ts';

interface FormContextType {
  currentForm: FormSchema | null;
  setCurrentForm: (form: FormSchema | null) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  updateField: (fieldId: string, value: any) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [currentForm, setCurrentForm] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <FormContext.Provider
      value={{
        currentForm,
        setCurrentForm,
        formData,
        setFormData,
        updateField
      }}
    >
      {children}
    </FormContext.Provider>
  );
};