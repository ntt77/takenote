import React from 'react';
import { Center, Stack, Text, Kbd } from '@mantine/core';

export const EmptyEditor: React.FC = () => {
  return (
    <Center style={{ flex: 1, height: '100%' }}>
      <Stack align="center" gap="xs">
        <Text fw={700}>Create a note</Text>
        <Text c="dimmed" size="sm">
          <Kbd size="sm">CTRL</Kbd> + <Kbd size="sm">ALT</Kbd> + <Kbd size="sm">N</Kbd>
        </Text>
      </Stack>
    </Center>
  );
};
