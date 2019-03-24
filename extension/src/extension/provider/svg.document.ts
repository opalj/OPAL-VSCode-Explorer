import * as vscode from 'vscode';
import {CommandService} from '../service/command.service';
import * as npmPath from 'path';

export default class SVGDocument {

    private _svgService : CommandService;
    private _projectId : string;
    private _target : vscode.Uri;
    private _opalConfig: any;

    constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>, projectId: string, target: vscode.Uri, config : any) {
        
        this._opalConfig = config;
        this._svgService = new CommandService(this._opalConfig.server.url);
        /*
        this._emitter = emitter;
        */
        
        this._projectId = projectId;
        this._target = target;
        
    }

    /**
     * Get the svg Text for this svg Document
     */
    get value() {
        return this._populate();	
    }

    public getDocText(){
        return this._populate;
    }

    /**
     * Get fqn path for file
     * @param targetFilePath Path to target file
     */
    async getFQN(targetsFilePath : string) {
        return targetsFilePath.replace(this._opalConfig.opal.targetsDir, "");
    }

    public async _populate() {
        //Extract Filename from URI
		var fileName:String = npmPath.parse(this._target.fsPath).base;
		//Set BC Service up
		
		if(fileName.includes(".svg")) {
            fileName = fileName.replace(".svg", "");

			//Request SVG for Class
            vscode.window.showInformationMessage('SVG for Class ' + fileName + ' requested from Server ..... ');
            
            var fqn = await this.getFQN(this._target.fsPath);
            var getSVGParams = {
                "fqn": fqn,
                "className":fileName
            };
			var svg = await this._svgService.loadAnyCommand("getBC", this._projectId, getSVGParams);
            return svg;
        } else {
            return "";
        }
    }
}