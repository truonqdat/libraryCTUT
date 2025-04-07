import React from "react";
import ReactDOM from "react-dom/client";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { router } from "./routes/Route";
import { RouterProvider } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle>
          <RouterProvider router={router} />
        </GlobalStyle>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
