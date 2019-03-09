import * as vscode from 'vscode';
import {TacService} from '../service/tac.service';

export default class TACDocument {

    /**
     * Links for the jumps to references
     */
    private _links: vscode.DocumentLink[];
    private _tacService : TacService;
    private _emitter: vscode.EventEmitter<vscode.Uri>;
    private _uri : vscode.Uri;
    
	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        
        this._links = [];
        
        /**
         * @TODO: provide URL by config
         */
        this._tacService = new TacService("http://localhost:8080");
        this._emitter = emitter;
        this._uri = uri; 
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
        
        var tac = await this._tacService.loadTAC("short1.txt");
        console.log(tac);
        this._emitter.fire(this._uri);
        return tac.tac;
        //return await this._tacService.loadTAC(tacForClassMessage);
    }
}