import * as vscode from 'vscode';
import TACDocument from './TACDocument';

export default class TACProvider implements vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider {

    static scheme = 'tac';

	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
	private _documents = new Map<string, TACDocument>();
	private _editorDecoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'underline' });
	private _subscriptions: vscode.Disposable;

	constructor() {

		// Listen to the `closeTextDocument`-event which means we must
		// clear the corresponding model object - `ReferencesDocument`
		this._subscriptions = vscode.workspace.onDidCloseTextDocument(doc => this._documents.delete(doc.uri.toString()));
    }
    
    dispose() {
		this._subscriptions.dispose();
		this._documents.clear();
		this._editorDecoration.dispose();
		this._onDidChange.dispose();
    }
    
    // Expose an event to signal changes of _virtual_ documents
	// to the editor
	get onDidChange() {
		return this._onDidChange.event;
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

    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        throw new Error("Method not implemented.");
    }
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
	return vscode.Uri.parse(`${TACProvider.scheme}:References.locations?${query}#${seq++}`);
}
