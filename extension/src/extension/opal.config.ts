import * as vscode from 'vscode';

export default class OpalConfig {
    /**
     * Open opal.config.json
    */
    public async getConfig() {
        var rootPath = vscode.workspace.rootPath;
	    var path: vscode.Uri = vscode.Uri.parse("file:"+rootPath+"/opal.config.json");
	    var document = await vscode.workspace.openTextDocument(path);
	    return JSON.parse(document.getText());
    }
    




}
