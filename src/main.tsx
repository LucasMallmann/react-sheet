import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style/reset.css";
import "./style/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loadSpreadSheetFromLocalStorage } from "./utils/spreadsheet.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:sheetId",
    element: <App />,
    loader: ({ params }) => {
      return loadSpreadSheetFromLocalStorage(params.sheetId);
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
