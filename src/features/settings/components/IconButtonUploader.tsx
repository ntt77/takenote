import React, { ChangeEvent, useRef } from 'react';
import { Button } from '@mantine/core';
export interface IconButtonUploaderProps {
  disabled?: boolean;
  handler: (file: File) => void;
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
  text: string;
  accept: string;
}

export const IconButtonUploader: React.FC<IconButtonUploaderProps> = ({ disabled = false, handler, icon: IconCmp, text, accept }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handler(e.target.files[0]);
    }
  };

  return (
    <div>
      <input accept={accept} tabIndex={-1} autoComplete="off" ref={inputRef} type="file" onChange={handleFileInput} style={{ display: 'none' }} />
      <Button
        onClick={handleClick}
        aria-label={text}
        disabled={disabled}
        variant="light"
        color="gray"
        size="sm"
        leftSection={<IconCmp size={20} aria-hidden="true" focusable="false" />}
        style={{ margin: '0.5rem 0', display: 'flex' }}>
        {text}
      </Button>
    </div>
  );
};
