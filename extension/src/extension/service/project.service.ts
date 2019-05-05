var request = require('request-promise-native');
import { workspace, Uri } from 'vscode';
import ClassDAO from './../model/class.dao';
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
    protected _libraries : Uri[] = [];
    protected _classDAO : ClassDAO;

    /**
     * HTTP URL
     * @param _url URL of the OPAL Server
     */
    constructor(public _url: string, projectId : string, classDAO : ClassDAO){
        this.serverUrl = _url;
        this._projectId = projectId;
        this._classDAO = classDAO;
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
        console.log(this.options);
        console.log(loadProjectMessage);
        return request.post(this.options);
    }

    async unLoad() {
        return request(this.serverUrl+"/opal/project/delete/"+encodeURIComponent(this._projectId));
    }

    /**
     * Requesting Logs from OPAL
     * While OPAL is doing stuff it will create Logs that can be retrieved with this method
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
        var targets = this._classDAO.getFsPaths();
        var libraries = await this.getLibrariesInWorkspace();
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


    async getLibrariesInWorkspace() : Promise<string[]> {
        let jarURIs = await workspace.findFiles("**/*.jar");
        let paths : string[] = new Array();
        jarURIs.forEach(jarURI => {
            paths.push(jarURI.fsPath);
        });
        return paths;
    }

    /**
     * Get all jar files in the libraries dir paths
     * @param librariesDirPaths Paths to the folder which contains libraries 
     */
    async addLibraries(librariesDirPaths : string) {
        let libFolders = [];
        libFolders = librariesDirPaths.split(";");
        var libraryPaths = [];

        //for every folder containing libraries
        for(let i = 0; i < libFolders.length; i++){
            //read its files
            let files = fs.readdirSync(libFolders[i]);
            for(let j = 0; j < files.length; j++){
                //and check for .jars to add them
                if(files[j].includes(".jar")){
                    libraryPaths.push(libFolders[i]+"/"+files[j]);
                    console.log("Added Library "+files[j]+" from folder "+libFolders[i]);
                }
            }
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