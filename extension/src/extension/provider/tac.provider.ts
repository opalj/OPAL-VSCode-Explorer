import * as vscode from 'vscode';
import TACDocument from './tac.document';


export default class TACProvider implements vscode.TextDocumentContentProvider {

    static scheme = 'tac';

	private _documents = new Map<string, TACDocument>();
	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    protected projectId = "";

	constructor(_projectId : string) {
        this.projectId = _projectId;
    }   
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.toString());
        if (document) {
            return document.value;
        }

        let params = decodeLocation(uri);
        document = new TACDocument(uri, this._onDidChange, this.projectId, params[0]);
        
        this._documents.set(uri.toString(), document);
        return document.value;
    }
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, projectId: string): vscode.Uri {
	const query = JSON.stringify([uri.toString(), projectId]);
	return vscode.Uri.parse(`${TACProvider.scheme}:test.tac?${query}#${seq++}`);
}

export function decodeLocation(uri: vscode.Uri): [vscode.Uri, string] {
	let [target, projectId] = <[string, string]>JSON.parse(uri.query);
	return [vscode.Uri.parse(target), projectId];
}
