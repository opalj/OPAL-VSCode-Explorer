// var rp = require('request-promise');
var request = require('request');

export class TacService {

    options = {
        "uri": "",
        "headers": {
        },
        "json": true,
        "simple": "false"
    };



    constructor(public _url: string) {
        this.options.uri = this._url;
    }

    async loadTAC(id: string) {
        this.options.uri += id;
        return new Promise((resolve, reject) => {
            request(this.options, function (error: any, response: any, body: any) {
                console.log(body);
                resolve(body);
            });
        });
    }
}