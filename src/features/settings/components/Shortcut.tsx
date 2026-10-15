import { Kbd, Group, Text } from '@mantine/core';

export interface ShortcutProps {
  action: string;
  letter: string;
}

export const Shortcut = ({ action, letter }: ShortcutProps) => {
  return (
    <Group justify="space-between" align="center" py={10} px={4} style={{ borderBottom: '1px solid #f0f0f0' }}>
      <Text size="sm" c="#333">
        {action}
      </Text>
      <Group gap={4} align="center">
        <Kbd size="sm">CTRL</Kbd> + <Kbd size="sm">ALT</Kbd> + <Kbd size="sm">{letter}</Kbd>
      </Group>
    </Group>
  );
};
