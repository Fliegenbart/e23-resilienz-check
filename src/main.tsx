import { createRoot } from "react-dom/client";
import QuickApp from "./quick/QuickApp";
import "./quick/styles.css";
import "./quick/provider.css";
createRoot(document.getElementById("root")!).render(<QuickApp />);
