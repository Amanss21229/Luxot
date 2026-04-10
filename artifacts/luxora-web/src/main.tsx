import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.documentElement.classList.add("dark");
document.documentElement.style.backgroundColor = "#0a0a0a";

createRoot(document.getElementById("root")!).render(<App />);
