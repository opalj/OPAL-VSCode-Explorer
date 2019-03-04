var request = require('request-promise-native');
import { workspace, RelativePattern } from 'vscode';

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

    protected serverUrl = "";

    constructor(public _url: string){
        this.serverUrl = _url;
    }

    /**
     * Send Project Params to OPAL
     * OPAL will load the Project.
     * This may take up to 10 mins
     */
    async load(config : any) {
        this.options.body = config;
        this.options.uri = this.serverUrl + "/opal/project/load";
        console.log(this.options);
        //Promise for sending classpath
        return request.post(this.options);
    }

    async requestLOG(config : any) {
        this.options.body = config;
        this.options.uri = this.serverUrl + "/opal/project/load/log";
        return request.post(this.options);
    }

    async getOPALInitMessage(targetsDirPath : string, librariesDirPath : string, config : Object)   {
        var projectID = await this.getProjectPath();
        var targets = await this.getTargets(targetsDirPath);
        var libraries = await this.getLibraries(librariesDirPath);
        return {
            "projectID" : projectID,
            "targets" : targets,
            "libraries" : libraries,
            "config" : config
        };
    }

    async getLogMessage(target : string, config : Object) {
        var projectID = await this.getProjectPath();
        return {
            "projectID" : projectID,
            "target" : target,
            "config" : config
        };
    }

    async getTargets(targetsDirPath : string) {
        var targets = await workspace.findFiles(new RelativePattern(targetsDirPath, "**/*.class"));
        var targetPaths = [];
        for (let target of targets) {
            targetPaths.push(target.fsPath);
        }
        return targetPaths;
    }


    async getLibraries(librariesDirPath : string) {
        var libraries = await workspace.findFiles(new RelativePattern(librariesDirPath, "*.jar"));
        var librariePaths = [];
        for (let librarie of libraries) {
            librariePaths.push(librarie.fsPath);
        }
        return librariePaths;
    }

    async getProjectPath() {
        var wsFolders =  workspace.workspaceFolders;
        if (wsFolders !== undefined) {
            return wsFolders[0].uri.fsPath;
        } else {
            return "";
        }
    }
}