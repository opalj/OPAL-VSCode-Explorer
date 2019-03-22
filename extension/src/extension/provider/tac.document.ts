import * as vscode from 'vscode';
import { CommandService } from '../service/command.service';
import * as npmPath from 'path';
import { pseudoRandomBytes } from 'crypto';


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

enum LineType{MethodStart, MethodEnd, GOTO, Caller, Irrelevant}

export class LinkParser {

    private links: vscode.DocumentLink[];
    private tacLines : string[];
    private lineTypes : LineType[]; 
    private docPath : vscode.Uri;

    constructor(docPath : vscode.Uri, tac : string) {
        this.links = [];
        this.tacLines = tac.split("\n");
        this.lineTypes = [LineType.Irrelevant, this.tacLines.length];
        this.docPath = docPath;
    }

    /**
     * parseJumps
     */
    public parseJumps() {
        this.analyzeLine();
        for(let i = this.tacLines.length-1; i >= 0; i--){
            switch (this.lineTypes[i]){
                case LineType.Caller:
                    let tmp = <RegExpExecArray> this.matchCaller(this.tacLines[i]);
                    for(let j = tmp.length-1; j > 0; j--){
                        let originRange : vscode.Range;
                        originRange = new vscode.Range(new vscode.Position(i, tmp[0].indexOf(tmp[j])),
                                                         new vscode.Position(i, tmp[0].indexOf(tmp[j])+tmp[j].length));
                        
                        let targetUri : vscode.Uri;
                        let targetLine = <number> this.getTargetLine(i, Number(tmp[j]));     
                        targetUri = vscode.Uri.parse(this.docPath.toString().concat(":"+String(targetLine)+":0"));

                        let res = this.documentLinkComposer(originRange, targetUri);
                    }
                    break;
                case LineType.GOTO:
                    break;
                case LineType.MethodStart:
                    break;
                case LineType.MethodEnd:
                    break;
                case LineType.Irrelevant:
                    break;
                default:
                    console.log("Something went wrong!");
                    break;
            }
        }
    }

    private documentLinkComposer(originRange : vscode.Range, targetUri : vscode.Uri){
        this.links.push(new vscode.DocumentLink(originRange, targetUri));
    }

    private analyzeLine(){
        for(let i = this.tacLines.length-1; i >= 0; i--){
            if(this.isCaller(this.tacLines[i])){
                this.lineTypes[i] = LineType.Caller;
            } else if (this.isGOTO(this.tacLines[i])){
                this.lineTypes[i] = LineType.GOTO;
            } else if (this.isMethodStart(this.tacLines[i])){
                this.lineTypes[i] = LineType.MethodStart;
            } else if (this.isMethodEnd(this.tacLines[i])){
                this.lineTypes[i] = LineType.MethodEnd;
            } else {
                this.lineTypes[i] = LineType.Irrelevant;
            }
        }
    }

    public isMethodStart(tacLine : string) {
        return tacLine.indexOf("){") >= 0 && tacLine.indexOf("}") === -1;
    }

    public isMethodEnd(tacLine : string) {
        return tacLine.indexOf("}") >= 0 && tacLine.indexOf("{") === -1;
    }

    public matchGOTO(tacLine : string) {
        const regex = /goto (\d+)/gm;
        let res = regex.exec(tacLine);
        if (res !== null) {
            return res;
        }
    }

    private isGOTO(tacLine : string) : boolean{
        const regex = /goto (\d+)/gm;
        return regex.test(tacLine);
    }

    public matchCaller(tacLine : string) {
        const regex = /\/\/(\\s|,|([0-9])*)*→/gm;
        let res = regex.exec(tacLine);
        let tmp : string[];
        if (res !== null) {
            res[1].replace(new RegExp(' ', 'g'), "");
            res[1].replace(new RegExp('/', 'g'), "");
            res[1].replace(new RegExp('→', 'g'), "");
            tmp = res[1].split(",");
            res.pop();
            res.concat(tmp);
            return res;
        }
    }

    private isCaller(tacLine : string) : boolean{
        const regex = /\/\/(\\s|,|([0-9])*)*→/gm;
        return regex.test(tacLine);
    }

    public matchLineIndex(tacLine : string) {
        const regex = /\b(\d):/gm;
        let m = regex.exec(tacLine);
        if (m !== null) {
            return m[1].replace(new RegExp(':', 'g'), "");
        }
    }

    private sameMethod(line1 : number, line2 : number){
        if(line1 === line2){
            return true;
        } else if(this.isMethodEnd(this.tacLines[line1])) {
            return false;
        }
        if(line1<line2){
            return this.sameMethod(line1+1, line2);
        }
        if(line1>line2){
            return this.sameMethod(line2, line1);
        }
    }

    private getTargetLine(originLine : number, targetID : number){
        for(let i = this.tacLines.length-1; i >= 0; i--){
            if(this.matchLineIndex(this.tacLines[i])){
                if(targetID = parseInt(<string>this.matchLineIndex(this.tacLines[i])){
                    if(this.sameMethod(i, originLine)){
                        return i;
                    }
                }
            }
        }
    }
}