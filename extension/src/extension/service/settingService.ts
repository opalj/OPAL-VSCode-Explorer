import * as vscode from "vscode";
import * as npmPath from "path";
var fs = require('file-system');


/**
 * This Service helps managing the extension's settings
 */
export default class SettingService {

    /**
     * Method to set default settings which depend on workspace, OS
     * and other local dependecies
     * @param activationContext extensions actviation context
     */
    public static async setDefaults(activationContext: vscode.ExtensionContext){
      const conf = vscode.workspace.getConfiguration();
      let oldWorkspace = <string>conf.get("OPAL.opal.targetDir");
      //in every case: adjust current rootPath
      await conf.update("OPAL.opal.targetDir", vscode.workspace.rootPath, true);
      if (conf.get("OPAL.opal.librariesDirs") === "") {
        //if empty, set it to current workspace root
        await conf.update("OPAL.opal.librariesDirs", vscode.workspace.rootPath, true);
      } else if ((<string>conf.get("OPAL.opal.librariesDirs")).includes(oldWorkspace)) {
        //if containing workspace root (and maybe persistend external library directories)
        let newFolders : string;
        newFolders = "";
        let oldFolders = (<string>conf.get("OPAL.opal.librariesDirs")).split(";");
        for(let i = 0; i < oldFolders.length; i++){
          if(oldFolders[i] === oldWorkspace){
            //replace old workspace root in librariesDirs with new one
            oldFolders[i] = <string> vscode.workspace.rootPath;
          }
          if(newFolders === ""){
            //set start of librariesDirs
            newFolders = oldFolders[i];
          } else {
            //add the rest of librariesDirs
            newFolders = newFolders+";"+oldFolders[i];
          }
        }
        console.log("New LibDirs set to: " + newFolders);
        await conf.update("OPAL.opal.librariesDirs", newFolders, true);
      }
      //if (conf.get("OPAL.server.jar") === "") {
          //get extension folder path
          let jarPath = ""+activationContext.extensionPath;
          
          //read content of extension folder path
          let files = fs.readdirSync(jarPath);
          //search for Opal Command Server jar
          for(let i = 0; i < files.length; i++){
            if(files[i].includes("OPAL Command Server") && files[i].includes(".jar")){
              //if found, add it to jar path
              jarPath = jarPath+"/"+files[i]; 
            }
          }
          console.log("OPAL Command Server jar at "+ jarPath);
          await conf.update("OPAL.server.jar", jarPath, true);
      //}
      return vscode.workspace.getConfiguration();
    }

    /**
     * Method to get current version of extension
     * @param activationContext 
     */
    public static getCurrentVersion(activationContext: vscode.ExtensionContext) : string {
      let version : string;
      version = "";

      //Try to get packageJson from extension folder
      var packageJsonFile = JSON.parse(fs.readFileSync(npmPath.join
              (activationContext.extensionPath, "package.json"), 'utf8'));

      if (packageJsonFile) {
        //set version, if successfull
        version = packageJsonFile.version;
        console.log("Active Extension Version: " + packageJsonFile.version);
      } else {
        //set version statically if above failed
        console.log("Something went wrong with fetching the active version, setting it statically...");
        console.log("This could cause setting errors which require manually changing settings.");
        //Try to get extension by its id
        let extension : vscode.Extension<any>;
        extension = <any>vscode.extensions.getExtension("java-bytecode-workbench");
        if(extension){
          //set version, if successfull
          version = extension.packageJSON.version;
        } else {
          //show error message, if not
          vscode.window.showErrorMessage(
            "Error at configuring settings. Please do so manually. Check ReadMe for more information."
          );
        }
      }
      return version;
    }

    /**
     * Method to check, whether the locally dependent settings are set
     */
    public static checkContent(){
        const conf = vscode.workspace.getConfiguration();
      	//check for empty fields in settings and report them
        if (conf.get("OPAL.opal.targetDir") === "" || conf.get("OPAL.opal.librariesDirs") === "" || conf.get("OPAL.server.jar") === "") {
            
            vscode.window.showErrorMessage(
              "Invalid settings, please reconfigure them manually. Check the extension's readme for more information."
            );
        }
    }
}