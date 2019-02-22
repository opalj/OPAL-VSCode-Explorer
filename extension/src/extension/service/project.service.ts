var request = require('request');
/**
 * Service for initiating opal
 */
export class ProjectService {

    protected options = {
        "uri": "",
        "headers": {
        },
        "body": {},
        "json": true
    };

    protected status = "";

    constructor(public _url: string){
        this.options.uri = _url+'/opal/project/load';
    }

    /**
     * Send Project Params to OPAL
     * OPAL will load the Project.
     * This may take up to 10 mins
     */
    async load(config : any) {
        this.options.body = config;
        console.log(this.options);
        //Promise for sending classpath
        return new Promise((resolve, reject) => {
            request.post(this.options, function (error: any, response: any, body: any) {
                if (error) {
                    //error handling
                    console.log("Error: ");
                    console.log(error);
                    reject(error);
                } else {
                    //response handling
                    console.log("Response: ");
                    console.log(response);
                    resolve(body);
                }
            });
        });
    }

    async requestLOG(config : any) {
        this.options.body = config;
        return new Promise((resolve, reject) => {
            request.post(this.options, function (error: any, response : any, body: any) {
                if (error) {
                    //error handling
                    console.log("Error: ");
                    console.log(error);
                    reject(error);
                } else {
                    //response handling
                    console.log("Response: ");
                    console.log(response);
                    resolve(body);
                }
            });
        });
    }
}