import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface FormField {
  name: string;
  placeholder: string;
  type?: string;
}

interface AddItemFormProps {
  title: string;
  icon: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
}

export function AddItemForm({ title, icon, fields, onSubmit }: AddItemFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = fields.every(field => formData[field.name]?.trim());
    
    if (isValid) {
      onSubmit(formData);
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-0 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <Input
              key={field.name}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="border-2 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
          ))}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-primary border-0 hover:scale-105 transition-transform shadow-card hover:shadow-glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {title.split(' ')[0]}
        </Button>
      </form>
    </Card>
  );
}