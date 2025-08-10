import React, { useState, useEffect } from 'react';
import { FormField, FormSchema, ValidationRule, FieldOption } from '../types/form.ts';
import { saveForm } from '../utils/localStorage.ts';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Textarea } from './ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { Switch } from './ui/switch.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Trash2, Plus, GripVertical, Settings } from 'lucide-react';
import { useFormContext } from '../contexts/FormContext.tsx';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom"; // add this

import "../global.css"; // Ensure global styles are imported
const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' }
];

export const FormBuilder: React.FC = () => {
  const { currentForm, setCurrentForm } = useFormContext();
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showFieldConfig, setShowFieldConfig] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentForm) {
      setFields(currentForm.fields);
      setFormName(currentForm.name);
    }
  }, [currentForm]);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      order: fields.length,
      options: ['select', 'radio', 'checkbox'].includes(type) ? [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ] : undefined
    };
    
    setFields(prev => [...prev, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = fields.findIndex(f => f.id === fieldId);
    if (
      (direction === 'up' && fieldIndex <= 0) ||
      (direction === 'down' && fieldIndex >= fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
    
    // Update order
    newFields.forEach((field, index) => {
      field.order = index;
    });
    
    setFields(newFields);
  };

  const saveCurrentForm = () => {
    if (!formName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    const formSchema: FormSchema = {
      id: currentForm?.id || `form_${Date.now()}`,
      name: formName,
      fields: fields.sort((a, b) => a.order - b.order),
      createdAt: currentForm?.createdAt || new Date().toISOString()
    };

    saveForm(formSchema);
    setCurrentForm(formSchema);
    setShowSaveDialog(false);
    toast.success('Form saved successfully!');
    window.location.reload();
;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Form Builder</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSaveDialog(true)}
            disabled={fields.length === 0}
          >
            Save Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field Types Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {FIELD_TYPES.map(type => (
                  <Button
                    key={type.value}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addField(type.value as FormField['type'])}
                  >
                    <Plus className="mr-2 size-4" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fields List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fields added yet. Start by adding a field from the left panel.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.sort((a, b) => a.order - b.order).map((field) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      onEdit={() => {
                        setSelectedField(field);
                        setShowFieldConfig(true);
                      }}
                      onDelete={() => deleteField(field.id)}
                      onMoveUp={() => moveField(field.id, 'up')}
                      onMoveDown={() => moveField(field.id, 'down')}
                      canMoveUp={field.order > 0}
                      canMoveDown={field.order < fields.length - 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Field Configuration Dialog */}
      <Dialog open={showFieldConfig} onOpenChange={setShowFieldConfig}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Field</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <FieldConfiguration
              field={selectedField}
              allFields={fields}
              onUpdate={(updates) => updateField(selectedField.id, updates)}
              onClose={() => setShowFieldConfig(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formName">Form Name</Label>
              <Input
                id="formName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="bg-black text-white" onClick={saveCurrentForm}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface FieldItemProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const FieldItem: React.FC<FieldItemProps> = ({
  field,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveUp}
          disabled={!canMoveUp}
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveDown}
          disabled={!canMoveDown}
        >
          ↓
        </Button>
      </div>
      
      <GripVertical className="size-4 text-muted-foreground" />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="capitalize font-medium">{field.type}</span>
          {field.required && <Badge variant="secondary">Required</Badge>}
          {field.isDerived && <Badge variant="outline">Derived</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{field.label}</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Settings className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

interface FieldConfigurationProps {
  field: FormField;
  allFields: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

const FieldConfiguration: React.FC<FieldConfigurationProps> = ({
  field,
  allFields,
  onUpdate,
  onClose
}) => {
  const [localField, setLocalField] = useState<FormField>({ ...field });

  const updateLocalField = (updates: Partial<FormField>) => {
    setLocalField(prev => ({ ...prev, ...updates }));
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required'
    };
    updateLocalField({
      validationRules: [...localField.validationRules, newRule]
    });
  };

  const updateValidationRule = (index: number, rule: ValidationRule) => {
    const updatedRules = [...localField.validationRules];
    updatedRules[index] = rule;
    updateLocalField({ validationRules: updatedRules });
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = localField.validationRules.filter((_, i) => i !== index);
    updateLocalField({ validationRules: updatedRules });
  };

  const addOption = () => {
    const newOption: FieldOption = {
      value: `option${(localField.options?.length || 0) + 1}`,
      label: `Option ${(localField.options?.length || 0) + 1}`
    };
    updateLocalField({
      options: [...(localField.options || []), newOption]
    });
  };

  const updateOption = (index: number, option: FieldOption) => {
    const updatedOptions = [...(localField.options || [])];
    updatedOptions[index] = option;
    updateLocalField({ options: updatedOptions });
  };

  const removeOption = (index: number) => {
    const updatedOptions = localField.options?.filter((_, i) => i !== index) || [];
    updateLocalField({ options: updatedOptions });
  };

  const handleSave = () => {
    onUpdate(localField);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <div className="space-y-4">
        <div>
          <Label>Field Label</Label>
          <Input
            value={localField.label}
            onChange={(e) => updateLocalField({ label: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={localField.required}
            onCheckedChange={(checked) => updateLocalField({ required: checked })}
          />
          <Label>Required Field</Label>
        </div>

        <div>
          <Label>Default Value</Label>
          <Input
            value={localField.defaultValue?.toString() || ''}
            onChange={(e) => updateLocalField({ defaultValue: e.target.value })}
            placeholder="Enter default value..."
          />
        </div>
      </div>

      {/* Field Options (for select, radio, checkbox) */}
      {['select', 'radio', 'checkbox'].includes(localField.type) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Options</Label>
            <Button size="sm" onClick={addOption}>
              <Plus className="size-4 mr-1" />
              Add Option
            </Button>
          </div>
          <div className="space-y-2">
            {localField.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) => updateOption(index, { ...option, value: e.target.value })}
                />
                <Input
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) => updateOption(index, { ...option, label: e.target.value })}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Derived Field Configuration */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Switch
            checked={localField.isDerived || false}
            onCheckedChange={(checked) => updateLocalField({ 
              isDerived: checked,
              derivedConfig: checked ? { parentFields: [], formula: '' } : undefined
            })}
          />
          <Label>Derived Field</Label>
        </div>

        {localField.isDerived && (
          <div className="space-y-3 p-3 border rounded-lg">
            <div>
              <Label>Parent Fields</Label>
              <Select
                onValueChange={(value) => {
                  const currentParents = localField.derivedConfig?.parentFields || [];
                  if (!currentParents.includes(value)) {
                    updateLocalField({
                      derivedConfig: {
                        ...localField.derivedConfig!,
                        parentFields: [...currentParents, value]
                      }
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent field" />
                </SelectTrigger>
                <SelectContent>
                  {allFields
                    .filter(f => f.id !== localField.id && !f.isDerived)
                    .map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label} ({f.type})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {localField.derivedConfig?.parentFields && localField.derivedConfig.parentFields.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {localField.derivedConfig.parentFields.map(fieldId => {
                  const parentField = allFields.find(f => f.id === fieldId);
                  return parentField ? (
                    <Badge key={fieldId} variant="secondary">
                      {parentField.label}
                      <button
                        className="ml-2 text-xs"
                        onClick={() => {
                          const updatedParents = localField.derivedConfig!.parentFields.filter(id => id !== fieldId);
                          updateLocalField({
                            derivedConfig: {
                              ...localField.derivedConfig!,
                              parentFields: updatedParents
                            }
                          });
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            <div>
              <Label>Formula</Label>
              <Textarea
                placeholder="e.g., field1 + field2 or new Date().getFullYear() - new Date(dateOfBirth).getFullYear()"
                value={localField.derivedConfig?.formula || ''}
                onChange={(e) => updateLocalField({
                  derivedConfig: {
                    ...localField.derivedConfig!,
                    formula: e.target.value
                  }
                })}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use field IDs from parent fields in your formula
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Validation Rules</Label>
          <Button size="sm" onClick={addValidationRule}>
            <Plus className="size-4 mr-1" />
            Add Rule
          </Button>
        </div>
        <div className="space-y-3">
          {localField.validationRules.map((rule, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Select
                  value={rule.type}
                  onValueChange={(value: ValidationRule['type']) =>
                    updateValidationRule(index, { ...rule, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="minLength">Min Length</SelectItem>
                    <SelectItem value="maxLength">Max Length</SelectItem>
                    <SelectItem value="email">Email Format</SelectItem>
                    <SelectItem value="password">Password (8+ chars, 1 number)</SelectItem>
                  </SelectContent>
                </Select>

                {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                  <Input
                    type="number"
                    placeholder="Length"
                    value={rule.value?.toString() || ''}
                    onChange={(e) =>
                      updateValidationRule(index, { ...rule, value: parseInt(e.target.value) })
                    }
                  />
                )}

                <Input
                  placeholder="Error message"
                  value={rule.message}
                  onChange={(e) =>
                    updateValidationRule(index, { ...rule, message: e.target.value })
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeValidationRule(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className='bg-black' onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};