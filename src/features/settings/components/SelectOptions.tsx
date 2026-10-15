import { Select, Group, Box, Text } from '@mantine/core';

export interface OptionProps {
  title: string;
  description: string;
  onChange: (selectedOption: any) => void;
  selectedValue: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectOptions = ({ title, description, onChange, selectedValue, options }: OptionProps) => {
  return (
    <Group justify="space-between" align="center" py="sm" gap="md" style={{ borderBottom: '1px solid #f0f0f0' }}>
      <Box style={{ flex: 1 }}>
        <Text fw={600} size="sm" c="#24292e" m={0}>
          {title}
        </Text>
        <Text size="xs" c="#6a737d" mt={2} style={{ lineHeight: 1.4 }}>
          {description}
        </Text>
      </Box>
      <Select
        data={options}
        value={selectedValue}
        onChange={(val) => val && onChange({ value: val })}
        size="sm"
        allowDeselect={false}
        checkIconPosition="right"
        style={{ minWidth: 160 }}
      />
    </Group>
  );
};
