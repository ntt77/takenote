import React, { MouseEventHandler } from 'react';
import { Tooltip, Button } from '@mantine/core';
export interface ActionButtonProps {
  disabled?: boolean;
  handler: MouseEventHandler;
  icon: React.ComponentType<{ size?: number | string; className?: string; color?: string; style?: React.CSSProperties }>;
  label: string;
  text: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ disabled = false, handler, icon: IconCmp, label, text }) => {
  return (
    <Tooltip label={label} withArrow position="right">
      <Button
        fullWidth
        variant="filled"
        color="blue"
        size="sm"
        radius="md"
        leftSection={<IconCmp size={20} aria-hidden="true" focusable="false" />}
        aria-label={label}
        onClick={handler}
        disabled={disabled}
        style={{ fontWeight: 600 }}>
        {text}
      </Button>
    </Tooltip>
  );
};
