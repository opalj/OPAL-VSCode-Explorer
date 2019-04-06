import * as vscode from 'vscode';
import TACDocument from './../document/tac.document';
import { AbstractProvider } from './abstract.provider';
import { decodeLocation } from './abstract.provider';


export default class TACProvider extends AbstractProvider {

    static scheme = 'tac';
  
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.query);
        if (document) {
            return document.value;
        }

        let params = decodeLocation(uri);
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
        return doc.parseDocumentLinks();
        //return Promise.resolve(doc.links);
    }
}
/*
let seq = 0;

export function encodeTACLocation(uri: vscode.Uri, projectId: string): vscode.Uri {
	const query = JSON.stringify([uri.toString(), projectId]);
	return vscode.Uri.parse(`${TACProvider.scheme}:OPAL.tac?${query}#${seq++}`);
}

export function decodeTACLocation(uri: vscode.Uri): [vscode.Uri, string] {
	let [target, projectId] = <[string, string]>JSON.parse(uri.query.replace(/\\/g, '/'));
	return [vscode.Uri.parse(target), projectId];
}
*/