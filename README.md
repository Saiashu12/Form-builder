# Dynamic Form Builder

A powerful, interactive form builder application built with React, TypeScript, and Tailwind CSS. Create dynamic forms with customizable fields, real-time validation, and advanced features like derived fields with auto-calculation capabilities.

![Dynamic Form Builder](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center)

## 🚀 Features

### Core Functionality
- **Dynamic Form Creation**: Build forms with 7 different field types
- **Real-time Preview**: See exactly how your form will look to end users
- **Form Management**: Save, edit, and organize all your forms
- **Local Storage**: No backend required - everything persists locally
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Field Types Supported
- **Text**: Single-line text input
- **Number**: Numeric input with validation
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Radio**: Single choice from multiple options
- **Checkbox**: Multiple choice selection
- **Date**: Date picker input

### Advanced Features
- **Derived Fields**: Auto-calculating fields based on other field values
- **Custom Validation**: Required fields, min/max length, email format, password strength
- **Field Reordering**: Drag and drop to rearrange form fields
- **Default Values**: Pre-populate fields with default data
- **Conditional Logic**: Fields that compute values from parent fields

### Validation Rules
- Required field validation
- Minimum and maximum length validation
- Email format validation
- Custom password rules (8+ characters, must contain number)
- Real-time validation feedback

## 🛠 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety and IntelliSense
- **React Router DOM 6** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **ShadCN UI** - Beautiful, accessible component library
- **Lucide React** - Consistent icon library
- **Sonner** - Toast notifications
- **Local Storage API** - Browser-based persistence

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd Dynamic-Form-Builder-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   The application will automatically open at `http://localhost:3000`

### Project Structure

```
Dynamic-Form-Builder-Application/
├── public/
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico             # App icon
├── src/
│   ├── components/
│   │   ├── FormBuilder.tsx     # Form creation interface
│   │   ├── FormPreview.tsx     # Form preview and interaction
│   │   ├── MyForms.tsx         # Saved forms management
│   │   ├── Navigation.tsx      # Main navigation component
│   │   └── ui/                 # ShadCN UI components
│   ├── contexts/
│   │   └── FormContext.tsx     # Global form state management
│   ├── types/
│   │   └── form.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── localStorage.ts     # Local storage utilities
│   │   └── validation.ts       # Form validation logic
│   ├── styles/
│   │   └── globals.css         # Global styles and Tailwind config
│   ├── App.tsx                 # Main application component
│   └── index.js                # React entry point
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎯 Usage Guide

### Creating a New Form

1. **Navigate to Form Builder**
   - Click "Create" in the navigation or "Create New Form" button

2. **Add Fields**
   - Choose from 7 field types in the left panel
   - Click any field type to add it to your form

3. **Configure Fields**
   - Click the settings icon on any field to configure:
     - Field label and default values
     - Required field toggle
     - Validation rules
     - Field options (for select, radio, checkbox)
     - Derived field settings

4. **Set Up Derived Fields**
   - Toggle "Derived Field" in field configuration
   - Select parent fields that will be used in calculation
   - Enter a formula (e.g., `field1 + field2` or age calculation)

5. **Reorder Fields**
   - Use the up/down arrows to change field order
   - Fields are numbered automatically

6. **Save Your Form**
   - Click "Save Form" and enter a form name
   - Form is saved to local storage

### Previewing Forms

1. **Go to Preview**
   - Navigate to the Preview page
   - Your current form will be displayed as end users would see it

2. **Test Functionality**
   - Fill out the form to test validation
   - Watch derived fields auto-calculate
   - See validation errors in real-time

3. **Submit Form**
   - Click submit to test the complete form flow
   - Form data is logged to browser console

### Managing Saved Forms

1. **View All Forms**
   - Go to "My Forms" to see all saved forms
   - Forms are sorted by creation date (newest first)

2. **Form Actions**
   - **Preview**: Open form in preview mode
   - **Edit**: Open form in builder for modifications
   - **Delete**: Remove form from storage (with confirmation)

3. **Form Information**
   - Each form card shows creation date, field count, and field types
   - Special badges indicate required fields and derived fields

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for React Router by creating a `_redirects` file in the `build` folder:
   ```
   /*    /index.html   200
   ```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🔧 Configuration

### Validation Rules
The application supports several validation types:

```typescript
// Example validation rule configuration
{
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password',
  value?: number,  // For min/max length rules
  message: string  // Custom error message
}
```

### Derived Field Formulas
Examples of supported formulas:

```javascript
// Simple arithmetic
"field1 + field2"
"price * quantity"

// Age calculation from date of birth
"new Date().getFullYear() - new Date(dateOfBirth).getFullYear()"
```

## 🎨 Customization

### Styling
- Uses Tailwind CSS v4 with custom CSS variables
- Dark mode support built-in
- Modify `/src/styles/globals.css` for theme customization

### Adding New Field Types
1. Add new type to `FormField['type']` in `/src/types/form.ts`
2. Update field type options in `FormBuilder.tsx`
3. Add rendering logic in `FormPreview.tsx`

## 🐛 Troubleshooting

### Common Issues

1. **npm start not working**
   - Make sure you're in the correct directory
   - Run `npm install` first
   - Check that Node.js is installed (`node --version`)

2. **Styling not loading**
   - Ensure `/src/styles/globals.css` is imported in `/src/index.js`
   - Check browser console for CSS errors

3. **Forms not saving**
   - Check if localStorage is enabled in your browser
   - Clear browser data and try again
   - Check browser console for JavaScript errors

4. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors in the terminal
   - Ensure all imports are correct

## 📝 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- Form templates for common use cases
- Export forms to JSON/PDF
- Form analytics and submission tracking
- Conditional field visibility
- Multi-step form support
- Form sharing via URL

---

**Happy Form Building!** 🎉