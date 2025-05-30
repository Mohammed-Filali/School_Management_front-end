import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/index.jsx";
import StudentContext from "./context/StudentContext.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { Store } from "./redux/store.js";

// Create a custom theme (optional but recommended)

function App() {
  return (
    <Provider store={Store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <StudentContext>
            <RouterProvider router={Router} />
            <Toaster />
          </StudentContext>
        </ThemeProvider>
    </Provider>
  );
}

export default App;