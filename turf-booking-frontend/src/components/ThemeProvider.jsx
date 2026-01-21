import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const colors = {
    dark: {
      bg: "#0f1115",
      surface: "#161a22",
      card: "#1e2430",
      text: "#e6e6e6",
      muted: "#9aa0a6",
      accent: "#0a7c2f",
      border: "#2a2f3a",
    },
    light: {
      bg: "#f4f6f5",
      surface: "#ffffff",
      card: "#ffffff",
      text: "#1e1e1e",
      muted: "#555",
      accent: "#0a7c2f",
      border: "#ddd",
    },
  };

  useEffect(() => {
    document.body.style.background = colors[theme].bg;
    document.body.style.color = colors[theme].text;
    document.body.style.margin = "0";
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, colors: colors[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
