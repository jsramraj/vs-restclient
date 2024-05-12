import * as vscode from "vscode";
import * as path from "path";
import { parseHttpContent, readHttpContent } from "./utils/http-parser";
import { HttpRequest, HttpConstant, HttpContent } from "./view/models/model";

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
    const httpContent = readHttpContent(document);
    const parsedValues = parseHttpContent(httpContent);
    console.log("Parsed values", parsedValues);

    webviewPanel.webview.html = this.getWebviewContent(parsedValues);
  }

  private getWebviewContent(content: HttpContent): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this.context.extensionUri.path, "restClient", "restClient.js")
    );
    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    // const configJson = `{"description":"This is a file containing a dummy config in order to test a webview react in VS Code.","name":"my config","users":[{"active":true,"name":"alice","roles":["user","admin"]},{"active":true,"name":"bob","roles":["user"]},{"active":false,"name":"charlie","roles":["user"]}]}`;
    const requests = JSON.stringify(content);

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Config View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${requests};
        </script>
    </head>
    <body>
        <div id="root"></div>

        <script src="${reactAppUri}"></script>
    </body>
    </html>`;
  }
}
