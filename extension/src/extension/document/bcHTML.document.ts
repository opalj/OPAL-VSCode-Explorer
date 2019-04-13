import AbstractDocument from "./abstract.document";

export default class BChtmlDocument extends AbstractDocument {
    public parseDocumentLinks(content: string): import("vscode").DocumentLink[] {
        throw new Error("Method not implemented.");
    }


    public loadContent(): Promise<string> {
      return this._commandService.loadAnyCommand("getBCForClassHTML", this._projectId, {"className" : this._class.name, "fileName": this._class.uri.fsPath});
    }
}