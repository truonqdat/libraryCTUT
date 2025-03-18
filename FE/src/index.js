import React from "react";
import ReactDOM from "react-dom/client";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { router } from "./routes/Route";
import { RouterProvider } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle";
import { ContextProvide } from "./components/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <GlobalStyle>
      <ContextProvide>
        <RouterProvider router={router} />
      </ContextProvide>
    </GlobalStyle>
  </ThemeProvider>
  // </React.StrictMode>
  //sao bỏ cái strictmode dị
);
