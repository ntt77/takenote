import React from 'react';
import { Select } from '@mantine/core';

export interface OptionProps {
  title: string;
  description: string;
  onChange: (selectedOption: any) => void;
  selectedValue: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectOptions: React.FC<OptionProps> = ({ title, description, onChange, selectedValue, options }) => {
  return (
    <div className="settings-option">
      <div>
        <h3>{title}</h3>
        <p className="description">{description}</p>
      </div>
      <Select
        data={options}
        value={selectedValue}
        onChange={(val) => val && onChange({ value: val })}
        size="sm"
        allowDeselect={false}
        checkIconPosition="right"
        style={{ minWidth: 160 }}
      />
    </div>
  );
};
