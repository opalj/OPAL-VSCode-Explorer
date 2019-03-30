var request = require('request-promise-native');
import { workspace, RelativePattern } from 'vscode';
var fs = require('file-system');

/**
 * This Service is communicating with OPAL.
 * It provides methods for creating and sending messages to OPAL via HTTP JSON encoded
 * Definition of the Messages are provided at the Server Model at \server\src\main\scala\opal\extension\vscode\model.scala
 */
export class ProjectService {

    /**
     * Parameters for HTTP Requests
     * See npm request package for more information
     */
    protected options = {
        "uri": "",
        "headers": {
        },
        "body": {},
        "json": true
    };

    protected serverUrl = "";
    protected projectId = "";

    /**
     * HTTP URL
     * @param _url URL of the OPAL Server
     */
    constructor(public _url: string, _projectId : string){
        this.serverUrl = _url;
        this.projectId = _projectId;
    }

    /**
     * Send Project Params to OPAL
     * This request will initialize OPAL and load the Project.
     * This may take up to 10 mins
     * @param loadProjectMessage Message for OPAL to load the Project
     */
    async load(loadProjectMessage : any) {
        this.options.body = loadProjectMessage;
        this.options.uri = this.serverUrl + "/opal/project/load";
        //Promise for sending classpath
        return request.post(this.options);
    }

    /**
     * Requesting Logs from OPAL
     * While OPAL is doing stuff it will create Logs that can be retrived with this method
     * @param loadProjectMessage Message for getting the OPAL Logs
     */
    async requestLOG(config : any) {
        this.options.body = config;
        this.options.uri = this.serverUrl + "/opal/project/load/log";
        return request.post(this.options);
    }

    /**
     * Create the OPAL Load Message.
     * @param targetsDirPath Path to the targets. Targets are class files that can be analyzed by OPAl
     * @param librariesDirPath Path to the libraries. Libraries are jar Files that may necessary for analyzing
     * @param config additional config params for opal 
     */
    async getOPALLoadMessage(targetsDirPath : string, librariesDirPath : string, config : Object)   {
        var projectId = this.projectId;
        var targets = await this.getTargets(targetsDirPath);
        var libraries = await this.getLibraries(librariesDirPath);
        return {
            "projectId" : projectId,
            "targets" : targets,
            "libraries" : libraries,
            "config" : config
        };
    }

    /**
     * Create the get Logs Message
     * @param target 
     * @param config 
     */
    async getLogMessage(target : string, config : Object) {
        var projectId = this.projectId;
        return {
            "projectId" : projectId,
            "target" : target,
            "config" : config
        };
    }

    /**
     * Get all class Files in the targets dir path
     * @param targetsDirPath Path to folder which contains targets
     */
    async getTargets(targetsDirPath : string) {
        var targets = await workspace.findFiles(new RelativePattern(targetsDirPath, "**/*.class"));
        var targetPaths = [];
        for (let target of targets) {
            targetPaths.push(target.fsPath);
        }
        return targetPaths;
    }

    /**
     * Get all jar files in the libraries dir paths
     * @param librariesDirPaths Paths to the folder which contains libraries
     */
    async getLibraries(librariesDirPaths : string) {
        let libFolders = [];
        libFolders = librariesDirPaths.split(";");
        var librariePaths = [];

        //for every folder containing libraries
        for(let i = 0; i < libFolders.length; i++){
            //read its files
            let files = fs.readdirSync(libFolders[i]);
            for(let j = 0; j < files.length; j++){
                //and check for .jars to add them
                if(files[j].includes(".jar")){
                    librariePaths.push(libFolders[i]+"/"+files[j]);
                    console.log("Added Library "+files[j]+" from folder "+libFolders[i]);
                }
            }

            /** 
            var libraries = await workspace.findFiles(new RelativePattern(libFolders[i], "*.jar"));
            for (let librarie of libraries) {
                librariePaths.push(librarie.fsPath);
            }*/
        }
        return librariePaths;
    }

    /**
     * Path to the current workspace
     */
    async getProjectPath() {
        var wsFolders =  workspace.workspaceFolders;
        if (wsFolders !== undefined) {
            return wsFolders[0].uri.fsPath;
        } else {
            return "";
        }
    }
}