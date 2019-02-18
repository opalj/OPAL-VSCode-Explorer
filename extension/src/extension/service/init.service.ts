var request = require('request');
/**
 * Service for initiating opal
 */

export class InitService {

    config:any = {};
    options = {
        "uri": "",
        "headers": {
        },
        "json": true
    };


    constructor(public _config: any){
        this.config = _config;
        this.options.uri = this.config.serverUrl;
    }

    /**
     * 
     */
    init(){
        //Promise for sending classpath
        return new Promise((resolve, reject) => {
            request(this.options, this.config.classpath, function (error: any, response: any, body: any) {
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