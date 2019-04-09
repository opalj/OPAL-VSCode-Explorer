var request = require('request-promise-native');
import { workspace, Uri, RelativePattern } from 'vscode';
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
    protected _projectId = "";
    protected _targetDir = "";

    protected _targets : Uri[] = [];
    protected _libraries : Uri[] = [];

    /**
     * HTTP URL
     * @param _url URL of the OPAL Server
     */
    constructor(public _url: string, projectId : string){
        this.serverUrl = _url;
        this._projectId = projectId;
    }

    get targetDir() : string {
        return this._targetDir;
    }

    get targets() : Uri[] {
        return this._targets;
    }

    targetAsStrings() : string[] {
        let res : string[] = [];
        this._targets.forEach(target => {
            res.push(target.fsPath);
        });
        return res;
    }

    get libraries() : Uri[] {
        return this.libraries;
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
        console.log(loadProjectMessage);
        //Promise for sending classpath
        return request.post(this.options);
    }

    async unLoad() {
        return request(this.serverUrl+"/opal/project/delete/"+encodeURIComponent(this._projectId));
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
    async getOPALLoadMessage(config : Object)   {
        var projectId = this._projectId;
        var targets = this.targetAsStrings();
        var libraries = this._libraries;
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
        var projectId = this._projectId;
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
    async addTargets(targetsDirPath : string) {
        this._targetDir = targetsDirPath[0];
        var targets = await workspace.findFiles(new RelativePattern(targetsDirPath[0], "**/*.class"));
        targets.forEach((target: Uri) => {
            this._targets.push(target);
        });
    }

    
    addTargetUris(targets : Uri[]) {
        /**
         * Be awarer of a possible BUG
         * ParamsConverterService.getFQN wil not be able to calculate the fqn based on the targets root
         * To get this fixed the fqn of alle targets must be calculated with the correct targets root 
         * of with a diffrent approach.
         */
        targets.forEach(target => {
            this._targets.push(target);
        });
    }

    setTargetUris(targets : Uri[]) {
        this._targets = targets;
    }

    /**
     * Get all jar files in the libraries dir paths
     * @param librariesDirPaths Paths to the folder which contains libraries
     */
    async addLibraries(librariesDirPaths : string) {
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