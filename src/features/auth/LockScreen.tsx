import { useState, type FormEvent } from 'react';
import { Modal, Button, Center, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { MdLock } from 'react-icons/md';
import { useAuthStore, useCategoriesStore, useNotesStore } from '@/store';

export const LockScreen = () => {
  const [password, setPassword] = useState('');
  const { isLocked, unlock, loading, error, clearError } = useAuthStore();
  const { syncNotesWithD1 } = useNotesStore();
  const { syncCategoriesWithD1 } = useCategoriesStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    const success = await unlock(password);
    if (success) {
      setPassword('');
      syncNotesWithD1();
      syncCategoriesWithD1();
    }
  };

  return (
    <Modal
      opened={isLocked}
      onClose={() => {}}
      centered
      size={380}
      padding="xl"
      radius="md"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        backgroundOpacity: 0.45,
        blur: 5,
      }}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md" align="center">
          <Center
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#ebf2ff',
              color: '#5183f5',
            }}>
            <MdLock size={28} />
          </Center>

          <Stack gap={4} align="center">
            <Title order={3} style={{ color: '#1a1f36', fontWeight: 600 }}>
              TakeNote Locked
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Enter your password to unlock your notes
            </Text>
          </Stack>

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              if (error) clearError();
            }}
            error={error}
            autoFocus
            style={{ width: '100%' }}
            styles={{
              input: {
                backgroundColor: '#ffffff',
                borderColor: error ? '#fa5252' : '#dcdfe6',
                color: '#1a1f36',
              },
            }}
          />

          <Button type="submit" fullWidth loading={loading} color="takenoteBlue" size="md">
            Unlock
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
