import * as vscode from "vscode";

type HttpConstant = { name: string; value: string };
type HttpRequest = {
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
};

export function readHttpContent(document: vscode.TextDocument): any {
  const text = document.getText();
  // console.log("readHttpContent", text);
  if (text.trim().length === 0) {
    return {};
  }

  try {
    return text;
  } catch {
    throw new Error(
      "Could not get document as json. Content is not valid json"
    );
  }
}

export function parseHttpContent(httpContent: string): {
  constants: HttpConstant[];
  requests: HttpRequest[];
} {
  const lines = httpContent.split("\n");
  const constants: HttpConstant[] = [];
  let requests: HttpRequest[] = [];
  let requestLines: string[] = [];

  for (var line of lines) {
    if (line.startsWith("@")) {
      const [name, value] = line.slice(1).split("=");
      constants.push({ name: name.trim(), value: value.trim() });
      continue;
    }

    // Replace all constants in the line
    for (const constant of constants) {
      const regex = new RegExp(`{{${constant.name}}}`, "g");
      line = line.replace(regex, constant.value);
    }

    if (line.startsWith("#") || line.startsWith("//") || line === "\n") {
      // Comment or empty line, ignore
      continue;
    } else if (
      line.startsWith("GET") ||
      line.startsWith("POST") ||
      line.startsWith("DELETE") ||
      line.startsWith("PUT")
    ) {
      // New request
      // If there is a request in progress, push it to requests
      if (requestLines.length > 0) {
        requests.push(parseRequest(requestLines));
        requestLines = [];
      }
      requestLines.push(line);
    } else {
      requestLines.push(line);
    }
  }

  if (requestLines.length > 0) {
    requests.push(parseRequest(requestLines));
  }

  return { constants, requests };
}

function parseRequest(requestLines: string[]): HttpRequest {
  // return empty object if requestLines is empty
  if (requestLines.length === 0) {
    return {
      name: "",
      method: "",
      url: "",
      headers: {},
      body: "",
    };
  }

  const [method, url] = requestLines[0].split(" ");
  const headers: Record<string, string> = {};
  let body = "";
  let i = 1;

  for (; i < requestLines.length; i++) {
    if (requestLines[i] === "") break;
    const [name, value] = requestLines[i].split(": ");
    headers[name] = value;
  }

  for (i++; i < requestLines.length; i++) {
    body += requestLines[i] + "\n";
  }

  return { name: method + " " + url, method, url, headers, body };
}

// Usage:
// const parsed = parseHttpContent(httpFileContent);
// console.log(parsed);
