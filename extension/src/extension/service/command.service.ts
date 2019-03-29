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
     * TACForMethod(projectId:String, fqn: String, methodName:Strinring)
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
    getFQN(targetFilePath : string, targetsDir : string) : string {
        let targetFileParts = this.getPathParts(targetFilePath);
        let targetsDirParts = this.getPathParts(targetsDir);

        console.log(targetFileParts);
        console.log(targetsDirParts);

        let path = "";
        /*
        if (targetFileParts !== null && targetsDirParts !== null) {
            targetFileParts = targetFileParts.filter(function(filePart) {
                return targetsDirParts.indexOf(filePart) < 0 && targetsDirParts.indexOf(filePart.toLocaleUpperCase()) < 0;
            });
            path = targetFileParts.join("/");
        }*/
        targetFileParts = targetFileParts.slice(targetsDirParts.length-1);
        path = targetFileParts.join("/");
        return path.replace("/class", "");
    }

    getPathParts(path : string) {
        const regex = /[a-zA-Z]+/gm;
        let match;
        let result = [];
        while ((match = regex.exec(path)) !== null) {
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result.push(match[0]);
        }
        return result;
    }
}