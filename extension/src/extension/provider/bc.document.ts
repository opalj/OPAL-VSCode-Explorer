import * as vscode from 'vscode';
import {TacService} from '../service/tac.service';
import {ProjectService} from '../service/project.service';
import OpalConfig from '../opal.config';
import * as npmPath from 'path';

export default class BCDocument {

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
    private _opalConfig: any;
    
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
        this._opalConfig = new OpalConfig().getConfig();
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
			//Request BC for Class
            vscode.window.showInformationMessage('BC for Class ' + fileName + ' requested from Server ..... ');
            var config = {
                "fqn" : this.getFQN(this._target.fsPath),
                "className" : fileName
            };
			var BC = await this._tacService.loadTAC(this._tacService.getAny(config, "getBC"));
            return BC;
        } else {
            return "";
        }
    }
}