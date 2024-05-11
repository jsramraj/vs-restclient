import * as vscode from "vscode";
import { getNonce } from "./util";
import * as fs from "fs";
import { parseHttpContent } from "./httpParser";
import ViewLoader from "./view/ViewLoader";

export class HttpEditProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new HttpEditProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      HttpEditProvider.viewType,
      provider
    );
    console.log("HttpEditProvider registered");
    return providerRegistration;
  }

  private static readonly viewType = "restClient.http";

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    console.log("Reading http content");
    const httpContent = this.readHttpContent(document);
    const parsedValues = parseHttpContent(httpContent);
    console.log("Parsed values", parsedValues);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "update",
        text: document.getText(),
      });
    }

    console.log("load hello world for webview");
    // this.loadRestPanelForWebView(webviewPanel.webview);

    this.displayPanel(webviewPanel.webview);

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );
  }

  private loadHelloWorldForWebView(webview: vscode.Webview) {
    // Read the helloWorld.html file
    const helloWorldHtmlPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "helloWorld.html"
    );
    const html = fs.readFileSync(helloWorldHtmlPath.fsPath, "utf8");
    return html;
  }

  private displayPanel(webview: vscode.Webview) {
    // Display the ViewLoader in the webview
    console.log("displayPanel");
    new ViewLoader(this.context.extensionUri);
  }

  private loadRestPanelForWebView(webview: vscode.Webview) {
    const helloWorldHtmlPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "helloWorld.html"
    );
    const html = fs.readFileSync(helloWorldHtmlPath.fsPath, "utf8");
    console.log("html", html);

    const scriptUri = "test.js";
    console.log("scriptUri", scriptUri);
    // const script = fs.readFileSync(scriptUri.fsPath, "utf8");
    // console.log("script content", script);

    webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'unsafe-eval' 'unsafe-inline' vscode-resource: https:; style-src vscode-resource: 'unsafe-inline' https:;">
          <title>Bruno</title>
        </head>
        <body style="background: red;">
          <div id="root"></div>
          <script src="${scriptUri}"></script>
        </body>
        </html>
      `;
  }

  private readHttpContent(document: vscode.TextDocument): any {
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
}
