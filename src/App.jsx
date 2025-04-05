import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/index.jsx";
import StudentContext from "./context/StudentContext.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { Store } from "./redux/store.js";



function App() {

  return (
    <Provider store={Store}>
      <StudentContext>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={Router} />
          <Toaster />
        </ThemeProvider>
      </StudentContext>
    </Provider>
  );
}

export default App;
