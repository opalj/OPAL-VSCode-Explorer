import * as vscode from 'vscode';
import BCDocument from './../document/bc.document';
import { AbstractProvider } from './abstract.provider';
import { decodeLocation } from './abstract.provider';

export default class BCProvider extends AbstractProvider {

    static scheme = 'bc';
  
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        let document = this._documents.get(uri.toString());
        if (document) {
            return document.value;
        }

        let params = decodeLocation(uri);
        document = new BCDocument(uri, this._onDidChange, this.projectId, params[0], this._config, this.targetsRoot);
        
        this._documents.set(uri.toString(), document);
        return document.value;
    }

    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        throw new Error("Method not implemented.");
    }
}

/*
let seq = 0;

export function encodeBCLocation(uri: vscode.Uri, projectId: string): vscode.Uri {
	const query = JSON.stringify([uri.toString(), projectId]);
	return vscode.Uri.parse(`${BCProvider.scheme}:OPAL.bc?${query}#${seq++}`);
}

export function decodeBCLocation(uri: vscode.Uri): [vscode.Uri, string] {
	let [target, projectId] = <[string, string]>JSON.parse(uri.query);
	return [vscode.Uri.parse(target), projectId];
}
*/