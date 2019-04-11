import * as vscode from "vscode";
import AbstractDocument from "./abstract.document";

export default class bcHTMLDocument extends AbstractDocument {
    public parseDocumentLinks(content: string): import("vscode").DocumentLink[] {
        throw new Error("Method not implemented.");
    }


    public async loadContent(projectId: string, target: vscode.Uri, targetsRoot : string): Promise<any> {
        try {
          return this._commandService.loadAnyCommand("getBCForClassHTML", projectId, {"className" : this._class.name, "fileName": this._class.fsPath});          
        } catch (e) {
          console.log(e);
        }
      }
}