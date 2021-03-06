import * as vscode from "vscode";
import TACDocument from "./../document/tac.document";
import BCDocument from "../document/bc.document";
import ClassDAO from "../model/class.dao";
import * as npmPath from "path";

export abstract class AbstractProvider
  implements vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider
{
  onDidChange?: vscode.Event<vscode.Uri> | undefined;

  protected _documents = new Map<string, TACDocument | BCDocument>();
  protected _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  protected _config: any;
  protected _classDAO: ClassDAO;
  protected projectId = "";

  constructor(_projectId: string, _config: any, classDAO: ClassDAO) {
    this.projectId = _projectId;
    this._config = _config;
    this._classDAO = classDAO;
  }

  abstract provideTextDocumentContent(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<string>;
  abstract provideDocumentLinks(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DocumentLink[]>;
}

let seq = 0;

export function encodeLocation(
  uri: vscode.Uri,
  projectId: string,
  scheme: string,
  variant = ""
): vscode.Uri {
  const fileName = npmPath.parse(uri.fsPath).base;
  const query = JSON.stringify([uri.toString(), projectId, variant]);
  return vscode.Uri.parse(
    `${scheme}:${fileName}.${scheme}?${query}#${variant}#${seq++}`
  );
}

export function decodeLocation(uri: vscode.Uri): [vscode.Uri, string, string] {
  const [target, projectId, variant] = <[string, string, string]>(
    JSON.parse(uri.query.replace(/\\/g, "/"))
  );
  return [vscode.Uri.parse(target), projectId, variant];
}
