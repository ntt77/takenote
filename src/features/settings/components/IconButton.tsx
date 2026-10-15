import React, { MouseEventHandler } from 'react';
import { Button } from '@radix-ui/themes';
import { Icon } from '@/icons';

import { iconColor } from '@/utils/constants';

export interface IconButtonProps {
  dataTestID?: string;
  disabled?: boolean;
  handler: MouseEventHandler;
  icon: Icon;
  text: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ dataTestID, disabled = false, handler, icon: IconCmp, text }) => {
  return (
    <Button data-testid={dataTestID} aria-label={text} onClick={handler} disabled={disabled} variant="soft" size="2" style={{ cursor: 'pointer', margin: '0.5rem 0' }}>
      <IconCmp size={18} color={iconColor} aria-hidden="true" focusable="false" />
      {text}
    </Button>
  );
};
