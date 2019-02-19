var request = require('request');
/**
 * Service for initiating opal
 */

export class InitService {

    options = {
        "uri": "",
        "headers": {
        },
        "json": true
    };


    constructor(public _url: string){
        this.options.uri = _url;
    }

    /**
     * 
     */
    init(config : string){
        //Promise for sending classpath
        return new Promise((resolve, reject) => {
            request(this.options, config, function (error: any, response: any, body: any) {
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