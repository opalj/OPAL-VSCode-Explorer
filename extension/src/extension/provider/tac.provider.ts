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

        /**
         * params[0] => class File URI
         */
       let params = decodeLocation(uri);
       let classItem = this._classDAO.getClassForURI(params[0]);
        document = new TACDocument(uri, this.projectId, params[0], this._config, classItem);
        
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
        let tac = doc.value;
        let links = doc.parseDocumentLinks(tac);
        return Promise.resolve(links);
    }
}