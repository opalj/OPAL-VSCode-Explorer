import * as vscode from 'vscode';
import TACDocument from './TACDocument';

export default class TACProvider implements vscode.TextDocumentContentProvider {

    static scheme = 'tac';

	private _documents = new Map<string, TACDocument>();
	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

	constructor() {
    }   
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.toString());
        if (document) {
            return document.value;
        }

        document = new TACDocument(uri, this._onDidChange);
        this._documents.set(uri.toString(), document);
        return document.value;
    }
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
	return vscode.Uri.parse(`${TACProvider.scheme}:References.locations?${query}#${seq++}`);
}


