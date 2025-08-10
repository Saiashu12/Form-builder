import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './contexts/FormContext.tsx';
import { Navigation } from './components/Navigation.tsx';
import { FormBuilder } from './components/FormBuilder.tsx';
import { FormPreview } from './components/FormPreview.tsx';
import { MyForms } from './components/MyForms.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import './global.css'; // Ensure global styles are imported
export default function App() {
  return (
    <FormProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/myforms" replace />} />
              <Route path="/create" element={<FormBuilder />} />
              <Route path="/preview" element={<FormPreview />} />
              <Route path="/myforms" element={<MyForms />} />
            </Routes>
          </main>
          
          <Toaster position="top-right" />
        </div>
      </Router>
    </FormProvider>
  );
}