import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

import { MdContrast } from "react-icons/md";

const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const isAuthenticated = false;

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      themeChange(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      const savedTheme = localStorage.getItem("selectedTheme");
      if (savedTheme) {
        setSelectedTheme(savedTheme);
        themeChange(savedTheme);
      }
    }
  }, [isAuthenticated]);

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setSelectedTheme(selectedTheme);
    themeChange(selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
  };

  return (
    <div className="flex flex-col items-center transition-all duration-300 rounded-full md:flex-row max-w-fit">
      <div className="py-2 md:pl-2 md:pr-4">
        <MdContrast className="w-8 h-8" />
      </div>
      <select
        className="py-1 rounded outline-none bg-base-300"
        data-choose-theme
        value={selectedTheme}
        onChange={handleThemeChange}
        title="Choose a theme"
      >
        <option value="dark">Default</option>
        <option value="light">Light</option>
        <option value="dracula">Dracula</option>
      </select>
    </div>
  );
};

export default Theme;
