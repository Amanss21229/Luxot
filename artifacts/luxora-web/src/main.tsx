import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const storedTheme = localStorage.getItem("luxora_theme");
if (storedTheme === "light") {
  document.documentElement.classList.add("light");
  document.documentElement.style.backgroundColor = "#faf8f4";
} else {
  document.documentElement.classList.add("dark");
  document.documentElement.style.backgroundColor = "#0a0a0a";
}

createRoot(document.getElementById("root")!).render(<App />);
