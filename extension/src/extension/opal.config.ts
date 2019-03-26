import * as vscode from 'vscode';

export default class OpalConfig {

    private _config : any;
    

    public async loadConfig() {
        var rootPath = vscode.workspace.rootPath;
        var path: vscode.Uri = vscode.Uri.parse("file:" + rootPath + "/opal.config.json");
        var document = await vscode.workspace.openTextDocument(path);
        this._config = JSON.parse(document.getText());
    }

    /**
     * Open opal.config.json
    */
    public getConfig() {
        return this._config;
    }
}
