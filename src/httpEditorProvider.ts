import * as vscode from "vscode";
import { getNonce } from "./util";
import * as fs from "fs";
import { parseHttpContent } from "./httpParser";

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
    console.log("load hello world for webview");
    webviewPanel.webview.html = this.loadHelloWorldForWebView(
      webviewPanel.webview
    );

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
