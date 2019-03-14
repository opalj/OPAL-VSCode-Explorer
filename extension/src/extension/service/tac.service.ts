var request = require('request-promise-native');

/**
 * Service for loading TAC examples
 * This Service is responsible for requesting TAC Data from the Server
 * The request / response body is always json encoded.
 * This Service is responsible for encoding / decoding the body
 */
export class TacService {

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
     * Get the request body for requesting TAC for a function
     * Check /server/src/main/scala/opal/vscode/model.scala for Details
     * TACForMethod(projectId:String, fqn: String, methodName:String, descriptor : String)
     */
    async getTACForMethodMessage() {
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
}