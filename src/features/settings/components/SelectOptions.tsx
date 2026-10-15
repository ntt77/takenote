import React from 'react';
import { Select } from '@radix-ui/themes';

export interface OptionProps {
  title: string;
  description: string;
  onChange: (selectedOption: any) => void;
  selectedValue: string;
  options: Array<{ value: string; label: string }>;
  testId: string;
}

export const SelectOptions: React.FC<OptionProps> = ({ title, description, onChange, selectedValue, options, testId }) => {
  return (
    <div className="settings-option">
      <div>
        <h3>{title}</h3>
        <p className="description">{description}</p>
      </div>
      <Select.Root value={selectedValue} onValueChange={(val) => onChange({ value: val })}>
        <Select.Trigger data-testid={testId} />
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};
