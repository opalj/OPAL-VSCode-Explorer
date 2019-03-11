import * as vscode from 'vscode';
import {TacService} from '../service/tac.service';
import * as npmPath from 'path';

export default class TACDocument {

    /**
     * Links for the jumps to references
     */
    private _links: vscode.DocumentLink[];
    private _tacService : TacService;
    /*
    private _emitter: vscode.EventEmitter<vscode.Uri>;
    private _uri : vscode.Uri;
    */
    private _projectId : string;
    private _target : vscode.Uri;
    
	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>, projectId: string, target: vscode.Uri) {
        
        this._links = [];
        
        /**
         * @TODO: provide URL by config
         */
        this._tacService = new TacService("http://localhost:8080");
        /*
        this._emitter = emitter;
        this._uri = uri;
        */
        this._projectId = projectId;
        this._target = target;
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
    public async _populate() {
        //Extract Filename from URI
		var fileName = npmPath.parse(this._target.fsPath).base;
		//Set Tac Service up
		
		if(fileName.includes(".java") || fileName.includes(".class")) {
			fileName = fileName.replace(".java", "");
			fileName = fileName.replace(".class", "");
			//Request TAC for Class
			vscode.window.showInformationMessage('TAC for Class ' + fileName + ' requested from Server ..... ');
			var tac = await this._tacService.loadTAC(this._tacService.getTACForClassMessage(this._projectId, fileName, fileName));
            //this._emitter.fire(this._uri);
            return tac;
        } else {
            return "";
        }
    }
}