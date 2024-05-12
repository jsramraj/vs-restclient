import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";
import { IConfig } from "../models/model";
import Config from "./config";
import RootPanel from "./components/root-panel";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: IConfig;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <RootPanel initialData={window.initialData} />,
  // <Config vscode={vscode} initialData={window.initialData} />,
  document.getElementById("root")
);
