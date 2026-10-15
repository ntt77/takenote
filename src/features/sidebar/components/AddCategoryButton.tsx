import { Tooltip, ActionIcon } from '@mantine/core';
import { FcPlus } from 'react-icons/fc';

export interface AddCategoryButtonProps {
  handler: (adding: boolean) => void;
  label: string;
}

export const AddCategoryButton = ({ handler, label }: AddCategoryButtonProps) => {
  return (
    <Tooltip label={label} withArrow position="right" openDelay={200}>
      <ActionIcon
        size={22}
        radius="sm"
        variant="subtle"
        onClick={() => handler(true)}
        aria-label={label}
        styles={{
          root: {
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#9e9e9e',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            },
            '&:active': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'scale(0.95)',
            },
          },
        }}>
        <FcPlus size={16} />
      </ActionIcon>
    </Tooltip>
  );
};
