import React, { useState, useEffect } from 'react';
import { FormSchema } from '../types/form.ts';
import { getSavedForms, deleteForm } from '../utils/localStorage.ts';
import { useFormContext } from '../contexts/FormContext.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { Badge } from './ui/badge.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog.tsx';
import { Eye, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import "../global.css"; // Ensure global styles are imported
export const MyForms: React.FC = () => {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const { setCurrentForm } = useFormContext();
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    const savedForms = getSavedForms();
    setForms(savedForms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handlePreview = (form: FormSchema) => {
    setCurrentForm(form);
    navigate('/preview');
  };

  const handleEdit = (form: FormSchema) => {
    setCurrentForm(form);
    navigate('/create');
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
    loadForms();
    toast.success('Form deleted successfully');
  };

  const handleCreateNew = () => {
    setCurrentForm(null);
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>My Forms</h1>
          <p className="text-muted-foreground">
            Manage your saved forms and create new ones
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 size-4" />
          Create New Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No forms created yet</h3>
                <p className="text-muted-foreground">
                  Get started by creating your first dynamic form
                </p>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 size-4" />
                Create Your First Form
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onPreview={() => handlePreview(form)}
              onEdit={() => handleEdit(form)}
              onDelete={() => handleDelete(form.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FormCardProps {
  form: FormSchema;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, onPreview, onEdit, onDelete }) => {
  const fieldTypeCounts = form.fields.reduce((acc, field) => {
    acc[field.type] = (acc[field.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const derivedFieldsCount = form.fields.filter(field => field.isDerived).length;
  const requiredFieldsCount = form.fields.filter(field => field.required).length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{form.name}</CardTitle>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <Calendar className="size-3" />
              {new Date(form.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(fieldTypeCounts).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {count} {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {requiredFieldsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {requiredFieldsCount} required
              </Badge>
            )}
            {derivedFieldsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {derivedFieldsCount} derived
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onPreview}
          >
            <Eye className="size-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            <Edit className="size-4 mr-1" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Form</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{form.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};