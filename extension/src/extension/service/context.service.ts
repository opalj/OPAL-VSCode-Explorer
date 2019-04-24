import { Uri } from "vscode";

var request = require('request-promise-native');

export default class ContextService {
    options = {
        "uri": "",
        "headers": {
        },
        "body":{},
        "json": true
    };

    protected serverUrl = "";

    constructor(public _url: string){
        this.serverUrl = _url+"/opal";
    }

    /**
     * Ask OPAL about the fqn of a class inside a .class File
     * @param filename 
     * @param className 
     */
    async loadFQNFromContext(filename : string) {
        this.options.body = filename;
        this.options.uri = this.serverUrl + "/context/class";
        return request.post(this.options);
    }

    async loadFQNFromContextBULK(filenames : Uri[])  {
        let fsPaths : String[] = new Array();
        filenames.forEach(filename => {
            fsPaths.push(filename.fsPath);
        });
        this.options.body = fsPaths;
        this.options.uri = this.serverUrl + "/context/class";
        return request.post(this.options);
    }
}