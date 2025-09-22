import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/themes';

interface ThemeContextType {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const muiTheme = useMemo(() => {
    if (!darkMode) return theme;
    return {
      ...theme,
      palette: {
        ...theme.palette,
        mode: 'dark',
        background: {
          default: '#181a20',
          paper: '#23272f',
        },
      },
    };
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ toggleDarkMode, darkMode }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};