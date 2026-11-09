import { createRoot } from "react-dom/client";
import QuickApp from "./quick/QuickApp";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/newsreader/opsz.css";
import "./quick/styles.css";
import "./quick/provider.css";
import "./quick/stress.css";
createRoot(document.getElementById("root")!).render(<QuickApp />);
