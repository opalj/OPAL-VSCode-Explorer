import * as vscode from 'vscode';
import TACDocument from './../document/tac.document';
import { AbstractProvider } from './abstract.provider';
import { decodeLocation } from './abstract.provider';


export default class TACProvider extends AbstractProvider {

    static scheme = 'tac';
  
 
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        /**
         * params[0] => class File URI
         * params[2] => TAC Variation
         */
        let params = decodeLocation(uri);

        let document = this._documents.get(params[0].fsPath+params[2]);
        if (document) {
            return document.value;
        }

       
       let classItem = this._classDAO.getClassForURI(params[0]);
       document = new TACDocument(uri, this.projectId, params[0], this._config, classItem, params[2]);
       this._documents.set(params[0].fsPath+params[2], document);

       if (!document.value) {
            return document.populate();
       } else {
            return document.value;
       }
    }

    /**
    * Method for requesting links for a tac document
     * 
     * @param document document for which links are requested
     * @param token cancellation token
     */
    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]>{
        /**
         * params[0] => class File URI
         * params[2] => TAC Variation
         */
        let params = decodeLocation(document.uri);
        let doc = this._documents.get(params[0].fsPath+params[2]);
        if (doc !== undefined) {
            let tac = document.getText();
            let links = doc.parseDocumentLinks(tac);
            return Promise.resolve(links);
        }
    }
}