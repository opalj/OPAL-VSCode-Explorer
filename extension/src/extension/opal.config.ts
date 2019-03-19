import * as vscode from 'vscode';

export default class OpalConfig {

    private static _config : any;

    /**
     * Open opal.config.json
    */
    public static async getConfig() {
        if (!this._config)  {
            var rootPath = vscode.workspace.rootPath;
            var path: vscode.Uri = vscode.Uri.parse("file:"+rootPath+"/opal.config.json");
            var document = await vscode.workspace.openTextDocument(path);
            this._config = JSON.parse(document.getText());
        }
        return this._config;
    }
}
