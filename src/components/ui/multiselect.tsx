import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectProps {
  name: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ name, options, selected, onChange }) => {
  const handleCheckboxChange = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{name}</label>
      <div className="space-y-2 border rounded-lg p-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={() => handleCheckboxChange(option)}
            />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
