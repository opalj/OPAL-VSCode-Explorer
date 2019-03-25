var request = require('request-promise-native');


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
     */
    loadTAC(tacForClassMessage: any) {
        console.log(tacForClassMessage);
        this.options.body = tacForClassMessage;
        this.options.uri = this.serverUrl + "/opal/project/tac/class";
        console.log(this.options);
        //Promise for sending classpath
        return request.post(this.options);
    }

    /**
     * Request any command from server
     * @param command 
     * @param params 
     */
    loadAnyCommand(command: String, projectId : string, params: any) {
        console.log(command);
        this.options.body = {"params": params,"command": command, "projectId":projectId};
        this.options.uri = this.serverUrl + "/opal/project/loadAny";
        return request.post(this.options);
    }

    /**
     * Get the request body for requesting TAC for a function
     * Check /server/src/main/scala/opal/vscode/model.scala for Details
     * TACForMethod(projectId:String, fqn: String, methodName:String, descriptor : String)
     */
    getTACForMethodMessage() {
        return {};
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
        };
    }

    /**
     * Get fqn path for file
     * @param targetFilePath Path to target file
     */
    getFQN(targetsFilePath : string, targetsDir : string, fileName : string) : string {
        /**
         * replace directory seperators with .
         */
        targetsFilePath = targetsFilePath.replace(/\\/g, ".");
        targetsFilePath = targetsFilePath.replace(/\//g, ".");
        
        /**
         * Remove path to Project
         */
        targetsDir = targetsDir.replace(/\\/g, ".");
        targetsDir = targetsDir.replace(/\//g, ".");
        return targetsFilePath.replace(targetsDir, "").replace(fileName, "").replace("\\", "").replace("/", "");
    }
}