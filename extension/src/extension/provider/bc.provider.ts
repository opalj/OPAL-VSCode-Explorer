import * as vscode from 'vscode';
import BCDocument from './bc.document';


export default class BCProvider implements vscode.TextDocumentContentProvider {

    static scheme = 'bc';

	private _documents = new Map<string, BCDocument>();
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _config : any;

    protected projectId = "";


	constructor(_projectId : string, _config : any) {
        this.projectId = _projectId;
        this._config = _config;
    }   
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.toString());
        if (document) {
            return document.value;
        }

        let params = decodeBCLocation(uri);
        document = new BCDocument(uri, this._onDidChange, this.projectId, params[0], this._config);
        
        this._documents.set(uri.toString(), document);
        return document.value;
    }
}

let seq = 0;

export function encodeBCLocation(uri: vscode.Uri, projectId: string): vscode.Uri {
	const query = JSON.stringify([uri.toString(), projectId]);
	return vscode.Uri.parse(`${BCProvider.scheme}:OPAL.bc?${query}#${seq++}`);
}

export function decodeBCLocation(uri: vscode.Uri): [vscode.Uri, string] {
	let [target, projectId] = <[string, string]>JSON.parse(uri.query);
	return [vscode.Uri.parse(target), projectId];
}
