var request = require('request');
/**
 * Service for initiating opal
 */

export class InitService {

    options = {
        "uri": "",
        "headers": {
        },
        "body": {},
        "json": true
    };

    constructor(public _url: string){
        this.options.uri = _url+'/opal/project/load';
    }

    /**
     * 
     */
    init(config : any) {
        config.status = "init opal";
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
}