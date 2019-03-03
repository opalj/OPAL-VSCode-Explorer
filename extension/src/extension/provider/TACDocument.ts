import * as vscode from 'vscode';
import {TacService} from './../service/tac.service';

export default class TACDocument {

    private _uri: vscode.Uri;
    private _emitter: vscode.EventEmitter<vscode.Uri>;
    /**
     * Links for the jumps to references
     */
    private _links: vscode.DocumentLink[];
    private _tacService : TacService;
    
	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        this._uri = uri;
        this._links = [];
        this._emitter = emitter;
        /**
         * @TODO: provide URL by config
         */
        this._tacService = new TacService("http://localhost:8080");
    }
    
    /**
     * Get the TAC Code of this TAC Document
     */
    get value() {
        return this._populate();	
    }

    get links() {
		return this._links;
    }
    
    /**
     * Get the Data of this document
     */
    private async _populate() {
        //var tacForClassMessage = await this._tacService.getTACForClassMessage();
        this._emitter.fire(this._uri);
        var tac = await this._tacService.loadTAC("short1.txt");
        console.log(tac);
        return tac;
        //return await this._tacService.loadTAC(tacForClassMessage);
    }
}