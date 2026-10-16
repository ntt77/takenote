import React from 'react';
import { Modal, Button, Text, Group, Stack } from '@mantine/core';
import { MdWarning } from 'react-icons/md';

export interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs" style={{ fontWeight: 600 }}>
          {danger && <MdWarning color="#fa5252" size={20} />}
          <span>{title}</span>
        </Group>
      }
      centered
      size="sm"
      padding="md"
      radius="md"
      withCloseButton>
      <Stack gap="md">
        <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
          {message}
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" size="xs" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            color={danger ? 'red' : 'blue'}
            variant="filled"
            size="xs"
            onClick={() => {
              onConfirm();
              onClose();
            }}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
