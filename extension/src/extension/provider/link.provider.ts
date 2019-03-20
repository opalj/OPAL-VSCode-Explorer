import * as vscode from "vscode";

/**
 * Class for requesting links for a document
 */
export default class LinkProvider implements vscode.DocumentLinkProvider {

    /**
     * Get Links for specified document 
     * @param document document which links are requested
     * @param token cancellation token
     */
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentLink[] {
		return [];
	}
}