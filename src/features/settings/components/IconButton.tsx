import React, { MouseEventHandler } from 'react';
import { Button } from '@mantine/core';
export interface IconButtonProps {
  disabled?: boolean;
  handler: MouseEventHandler;
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
  text: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ disabled = false, handler, icon: IconCmp, text }) => {
  return (
    <Button
      aria-label={text}
      onClick={handler}
      disabled={disabled}
      variant="light"
      color="gray"
      size="sm"
      leftSection={<IconCmp size={20} aria-hidden="true" focusable="false" />}
      style={{ margin: '0.5rem 0', display: 'flex' }}>
      {text}
    </Button>
  );
};
