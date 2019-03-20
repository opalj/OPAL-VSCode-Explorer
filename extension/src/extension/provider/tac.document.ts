import * as vscode from 'vscode';
import { CommandService } from '../service/command.service';
import * as npmPath from 'path';


export default class TACDocument {

    /**
     * Links for the jumps to references
     */
    private _links: vscode.DocumentLink[];
    private _tacService : CommandService;
    /*
    private _emitter: vscode.EventEmitter<vscode.Uri>;
    private _uri : vscode.Uri;
    */
    private _projectId : string;
    private _target : vscode.Uri;
    private _opalConfig: any;
    
	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>, projectId: string, target: vscode.Uri, config : any) {
        
        this._links = [];
        
        this._opalConfig = config;
        this._tacService = new CommandService(this._opalConfig.server.url);
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
    private async _populate() {
        //Extract Filename from URI
        var fileName = npmPath.parse(this._target.fsPath).base;
        var fqn = await this._tacService.getFQN(this._target.fsPath);
		//Set Tac Service up
		
		if(fileName.includes(".class")) {
			fileName = fileName.replace(".class", "");
			//Request TAC for Class
			vscode.window.showInformationMessage('TAC for Class ' + fileName + ' requested from Server ..... ');
			var tac = await this._tacService.loadTAC(this._tacService.getTACForClassMessage(this._projectId, fqn, fileName));
            
            return tac;
        } else {
            return "";
        }
    }

    public static _parseDoc(tac : string) {
        let tacLines = tac.split("\n");
        console.log(tacLines);
        for (let i=tacLines.length-1; i >= 0; i--) {

            let tacLine = tacLines[i];
            let lineIndex = tacLine.match("\s\d:");
            console.log(lineIndex);
            if (lineIndex !== null && lineIndex.length === 1) {
                console.log(lineIndex);                
            }

            let callers = tacLine.match("\/\/ \d(, \d)* →");
            console.log(callers);
            if (callers !== null) {
                callers.forEach(caller => {

                });
            }
        }
    }
}