// var rp = require('request-promise');


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
        var request = require('request');
        return new Promise((resolve, reject) => {
            request(this.options, function (error: any, response: any, body: any) {
                console.log(body);
                resolve(body);
            });
        });
    }
}