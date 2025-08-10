import React, { useState, useEffect } from 'react';
import { FormField, FormData } from '../types/form.ts';
import { validateField, calculateDerivedValue } from '../utils/validation.ts';
import { useFormContext } from '../contexts/FormContext.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Textarea } from './ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.tsx';
import { Checkbox } from './ui/checkbox.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import "../global.css"; // Ensure global styles are imported

export const FormPreview: React.FC = () => {
  const { currentForm } = useFormContext();
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentForm) {
      // Initialize form data with default values
      const initialData: FormData = {};
      currentForm.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  }, [currentForm]);

  useEffect(() => {
    // Calculate derived fields whenever form data changes
    if (currentForm) {
      const updatedData = { ...formData };
      let hasChanges = false;

      currentForm.fields
        .filter(field => field.isDerived && field.derivedConfig)
        .forEach(field => {
          const newValue = calculateDerivedValue(
            field.derivedConfig!.formula,
            formData
          );
          if (updatedData[field.id] !== newValue) {
            updatedData[field.id] = newValue;
            hasChanges = true;
          }
        });

      if (hasChanges) {
        setFormData(updatedData);
      }
    }
  }, [formData, currentForm]);

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear errors for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!currentForm) return false;

    const newErrors: Record<string, string[]> = {};
    let isValid = true;

    currentForm.fields.forEach(field => {
      if (!field.isDerived) { // Don't validate derived fields
        const fieldErrors = validateField(formData[field.id], field.validationRules);
        if (fieldErrors.length > 0) {
          newErrors[field.id] = fieldErrors;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Form submitted successfully!');
      console.log('Form Data:', formData);
    } else {
      toast.error('Please fix the validation errors');
    }

    setIsSubmitting(false);
  };

  if (!currentForm) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            No form selected for preview. Please go to the Form Builder to create a form first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{currentForm.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentForm.fields
              .sort((a, b) => a.order - b.order)
              .map(field => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  errors={errors[field.id] || []}
                  onChange={(value) => updateField(field.id, value)}
                />
              ))}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  errors: string[];
  onChange: (value: any) => void;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  errors,
  onChange
}) => {
  const hasErrors = errors.length > 0;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={hasErrors ? 'border-destructive' : ''}
            disabled={field.isDerived}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
            className={hasErrors ? 'border-destructive' : ''}
            disabled={field.isDerived}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={hasErrors ? 'border-destructive' : ''}
            disabled={field.isDerived}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={field.isDerived}
          >
            <SelectTrigger className={hasErrors ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={field.isDerived}
            className={hasErrors ? 'border border-destructive rounded-md p-2' : ''}
          >
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className={`space-y-2 ${hasErrors ? 'border border-destructive rounded-md p-2' : ''}`}>
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValue = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValue, option.value]);
                    } else {
                      onChange(currentValue.filter((v: string) => v !== option.value));
                    }
                  }}
                  disabled={field.isDerived}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={hasErrors ? 'border-destructive' : ''}
            disabled={field.isDerived}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
        {field.isDerived && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
            Auto-calculated
          </span>
        )}
      </Label>
      
      {renderField()}
      
      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};