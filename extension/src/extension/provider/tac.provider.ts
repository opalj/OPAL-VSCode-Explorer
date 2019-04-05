import * as vscode from 'vscode';
import TACDocument from './tac.document';



export default class TACProvider implements vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider {

    static scheme = 'tac';

	private _documents = new Map<string, TACDocument>();
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _config : any;
    public targetsRoot : string;

    protected projectId = "";

	constructor(_projectId : string, _config : any, _targets : string) {
        this.projectId = _projectId;
        this._config = _config;
        this.targetsRoot = _targets;
    }   
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.toString());
        if (document) {
            return document.value;
        }

        let params = decodeTACLocation(uri);
        document = new TACDocument(uri, this._onDidChange, this.projectId, params[0], this._config, this.targetsRoot);
        
        this._documents.set(uri.toString(), document);
        return document.value;
    }

    /**
    * Method for requesting links for a tac document
     * 
     * @param document document for which links are requested
     * @param token cancellation token
     */
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]>{
        let doc : TACDocument;
        doc = <any> this._documents.get(document.uri.toString());
        doc._parseDoc(doc.value.toString());
        return Promise.resolve(doc.links);
    }
}

let seq = 0;

export function encodeTACLocation(uri: vscode.Uri, projectId: string): vscode.Uri {
	const query = JSON.stringify([uri.toString(), projectId]);
	return vscode.Uri.parse(`${TACProvider.scheme}:OPAL.tac?${query}#${seq++}`);
}

export function decodeTACLocation(uri: vscode.Uri): [vscode.Uri, string] {
	let [target, projectId] = <[string, string]>JSON.parse(uri.query.replace(/\\/g, '/'));
	return [vscode.Uri.parse(target), projectId];
}
