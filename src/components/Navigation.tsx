import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button.tsx';
import { Plus, Eye, List } from 'lucide-react';
import "../global.css"; // Ensure global styles are imported

export const Navigation: React.FC = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold">Dynamic Form Builder</h1>
            
            <div className="flex items-center space-x-1">
              <Button asChild variant="ghost" className="flex items-center gap-2">
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  <Plus className="size-4" />
                  Create
                </NavLink>
              </Button>
              
              <Button asChild variant="ghost" className="flex items-center gap-2">
                <NavLink
                  to="/preview"
                  className={({ isActive }) =>
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  <Eye className="size-4" />
                  Preview
                </NavLink>
              </Button>
              
              <Button asChild variant="ghost" className="flex items-center gap-2">
                <NavLink
                  to="/myforms"
                  className={({ isActive }) =>
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  <List className="size-4" />
                  My Forms
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};