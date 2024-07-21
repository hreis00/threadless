import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState("");

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedTheme(theme);
      themeChange(theme);
      localStorage.setItem("selectedTheme", theme);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      themeChange(savedTheme);
    }
  }, []);

  return (
    <div className="flex items-center gap-2 p-2 transition-all duration-300 rounded-full max-w-fit">
      <p>Choose the theme you want to use</p>
      <div className="flex gap-2 ">
        <div>
          <label className="flex gap-2 p-2 overflow-hidden border rounded-lg cursor-pointer bg-base-100 border-base-content/20 outline outline-2 outline-offset-2 outline-transparent">
            <input
              type="radio"
              value="light"
              className="self-center theme-controller"
              checked={selectedTheme === "light"}
              onChange={handleThemeChange}
            />
            <div className="font-bold">Light</div>
          </label>
        </div>
        <div>
          <label className="flex gap-2 p-2 overflow-hidden border rounded-lg cursor-pointer bg-base-100 border-base-content/20 outline outline-2 outline-offset-2 outline-transparent">
            <input
              type="radio"
              value="dark"
              className="self-center theme-controller"
              checked={selectedTheme === "dark"}
              onChange={handleThemeChange}
            />
            <div className="font-bold">Dark</div>
          </label>
        </div>
        <div>
          <label className="flex gap-2 p-2 overflow-hidden border rounded-lg cursor-pointer border-base-content/20 outline outline-2 outline-offset-2 outline-transparent">
            <input
              type="radio"
              value="dracula"
              className="self-center theme-controller"
              checked={selectedTheme === "dracula"}
              onChange={handleThemeChange}
            />
            <div className="font-bold">Dracula</div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Theme;
