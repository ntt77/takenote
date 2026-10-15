import React from 'react';
import { Icon } from '@/icons';

export interface TabPanelProps {
  label: string;
  icon: Icon;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <section>{children}</section>;
};
