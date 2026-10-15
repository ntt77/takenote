import { UnstyledButton, Text, Group } from '@mantine/core';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { FcFolder } from 'react-icons/fc';

export interface CollapseCategoryListButtonProps {
  handler: () => void;
  label: string;
  isCategoryListOpen: boolean;
  showIcon: boolean;
}

export const CollapseCategoryListButton = ({ handler, label, isCategoryListOpen, showIcon }: CollapseCategoryListButtonProps) => {
  return (
    <UnstyledButton
      onClick={handler}
      aria-label={label}
      styles={{
        root: {
          display: 'flex',
          alignItems: 'center',
          color: '#909090',
          transition: 'color 0.15s ease',
          '&:hover': {
            color: 'white',
          },
        },
      }}>
      <Group gap={8} align="center">
        {showIcon ? isCategoryListOpen ? <MdKeyboardArrowDown size={20} /> : <MdKeyboardArrowRight size={20} /> : <FcFolder size={16} />}
        <Text
          component="h2"
          style={{
            margin: 0,
            fontSize: '0.8rem',
            letterSpacing: '0.04em',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'inherit',
          }}>
          Categories
        </Text>
      </Group>
    </UnstyledButton>
  );
};
