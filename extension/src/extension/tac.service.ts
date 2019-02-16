var request = require('request');

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
        "json": true
    };


    /**
     * Constructor
     * @param _url Full URL of the Server 
     */
    constructor(public _url: string) {
        this.options.uri = this._url;
    }

    /**
     * Requesting TAC from Server
     * @param id of the tac example (e.g. filename)
     */
    async loadTAC(id: string) {
        this.options.uri += id;
        return new Promise((resolve, reject) => {
            request(this.options, function (error: any, response: any, body: any) {
                if (error) {
                    console.log("Error: ")
                    console.log(error);
                    reject(error)
                } else {
                    console.log("Response: ");
                    console.log(response);
                    resolve(body);
                }
            });
        });
    }
}