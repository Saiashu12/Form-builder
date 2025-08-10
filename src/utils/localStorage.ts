import { FormSchema } from '../types/form.ts';

const FORMS_STORAGE_KEY = 'dynamicFormBuilder_forms';

export const saveForm = (form: FormSchema): void => {
  try {
    const existingForms = getSavedForms();
    const updatedForms = [...existingForms.filter(f => f.id !== form.id), form];
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error saving form:', error);
  }
};

export const getSavedForms = (): FormSchema[] => {
  try {
    const formsJson = localStorage.getItem(FORMS_STORAGE_KEY);
    return formsJson ? JSON.parse(formsJson) : [];
  } catch (error) {
    console.error('Error loading forms:', error);
    return [];
  }
};

export const getFormById = (id: string): FormSchema | null => {
  const forms = getSavedForms();
  return forms.find(form => form.id === id) || null;
};

export const deleteForm = (id: string): void => {
  try {
    const forms = getSavedForms();
    const updatedForms = forms.filter(form => form.id !== id);
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error deleting form:', error);
  }
};