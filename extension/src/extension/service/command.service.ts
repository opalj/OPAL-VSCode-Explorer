var request = require('request-promise-native');
import * as vscode from "vscode";

/**
 * Service for OPAL Commands
 * This Service is responsible for requesting Data from the Server using OPAL Commands
 * The request / response body is always json encoded.
 * This Service is responsible for encoding / decoding the body
 */
export class CommandService {

    options = {
        "uri": "",
        "headers": {
        },
        "body":{},
        "json": true
    };

    protected serverUrl = "";

    constructor(public _url: string){
        this.serverUrl = _url;
    }

    /**
     * Requesting TAC from Server
     * The load Project Command is called every time method is called
     * The Server will not load the Project twice
     * @param tacForClassMessage The message for requesting the TAC for a Class
     */
    async loadTAC(tacForClassMessage: any) {
        await vscode.commands.executeCommand("extension.loadProject");
        console.log(tacForClassMessage);
        this.options.body = tacForClassMessage;
        this.options.uri = this.serverUrl + "/opal/project/tac/class";
        //Promise for sending classpath
        return request.post(this.options);
    }

    /**
     * Request any command from server
     * The load Project Command is called every time method is called
     * The Server will not load the Project twice
     * @param command the command for opal
     * @param params the params required for the comamnd
     * @param projectId the ID of the Project
     */
    loadAnyCommand(command: String, projectId : string, params: any) {
        vscode.commands.executeCommand("extension.loadProject");
        this.options.body = {"params": params,"command": command, "projectId":projectId};
        this.options.uri = this.serverUrl + "/opal/project/loadAny";
        return request.post(this.options);
    }



    /**
     * Get the request body for requesting TAC for a class
     * Check /server/src/main/scala/opal/vscode/model.scala for Details
     * TACForClass(projectId:String, fqn:String, className:String)
     */
    getTACForClassMessage(projectId:String, fqn:String, className:String) {
        return {
            "projectId" : projectId,
            "fqn" : fqn,
            "className" : className,
            "version" : ""
        };
    }
}