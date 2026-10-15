import { Switch, Group, Box, Text } from '@mantine/core';

export interface OptionProps {
  title: string;
  description: string;
  toggle: () => void;
  checked: boolean;
}

export const Option = ({ title, description, toggle, checked }: OptionProps) => {
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
      <Switch checked={checked} onChange={toggle} size="md" />
    </Group>
  );
};
