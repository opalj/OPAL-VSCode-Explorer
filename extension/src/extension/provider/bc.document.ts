import * as vscode from 'vscode';
import {CommandService} from '../service/command.service';
import * as npmPath from 'path';

export default class BCDocument {

    /**
     * Links for the jumps to references
     */
    private _links: vscode.DocumentLink[];
    private _commandService : CommandService;
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
        this._commandService = new CommandService(this._opalConfig.server.url);
        /*
        this._emitter = emitter;
        this._uri = uri;
        */
        this._projectId = projectId;
        this._target = target;
        
    }
    
    /**
     * Get the BC Code of this BC Document
     */
    get value() {
        return this._populate();	
    }

    get links() {
		return this._links;
    }

    /**
     * Get fqn path for file
     * @param targetFilePath Path to target file
     */
    async getFQN(targetsFilePath : string) {
        return targetsFilePath.replace(this._opalConfig.opal.targetsDir, "");
    }
    
    /**
     * Get the Data of this document
     */
    public async _populate() {
        //Extract Filename from URI
		var fileName:String = npmPath.parse(this._target.fsPath).base;
		//Set BC Service up
		
		if(fileName.includes(".class")) {
            fileName = fileName.replace(".java", "");
            fileName = fileName.replace(".class", "");
			//Request BC for Class
            vscode.window.showInformationMessage('BC for Class ' + fileName + ' requested from Server ..... ');
            var fqn = await this.getFQN(this._target.fsPath);

            var getBCParams = {
                "fqn": fqn,
                "className":fileName
            };
            var BC = await this._commandService.loadAnyCommand("getBC", this._projectId, getBCParams);
            return BC;
        } else {
            return "";
        }
    }
}