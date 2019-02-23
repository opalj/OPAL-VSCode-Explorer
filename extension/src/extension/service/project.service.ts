var request = require('request-promise-native');
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

    protected url = "";

    protected status = "";

    constructor(public _url: string){
        this.url = _url;
    }

    /**
     * Send Project Params to OPAL
     * OPAL will load the Project.
     * This may take up to 10 mins
     */
    async load(config : any) {
        this.options.body = config;
        this.options.uri = this.url + "/opal/project/load";
        console.log(this.options);
        //Promise for sending classpath
        return request.post(this.options);
    }

    async requestLOG(config : any) {
        this.options.body = config;
        this.options.uri = this.url + "/opal/project/load/log";
        return request.post(this.options);
    }
}