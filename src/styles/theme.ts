import { createTheme, MantineColorsTuple } from '@mantine/core';

// Primary TakeNote brand blue palette (#5183f5) with 10 Mantine shades
const takenoteBlue: MantineColorsTuple = [
  '#ebf2ff',
  '#d5e2ff',
  '#a8c4fe',
  '#7aa4fd',
  '#5183f5', // primary shade
  '#3b6edb',
  '#2a55b8',
  '#1b3e94',
  '#0f2871',
  '#06144e',
];

export const theme = createTheme({
  primaryColor: 'takenoteBlue',
  primaryShade: 4,
  colors: {
    takenoteBlue,
  },
  fontFamily: 'system-ui, sans-serif',
  fontFamilyMonospace: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  defaultRadius: 'sm',
  cursorType: 'pointer',
});
