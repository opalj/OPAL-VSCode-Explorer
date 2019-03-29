import * as vscode from "vscode";
import * as npmPath from "path";
var fs = require('file-system');


/**
 * This Service helps managing the extension's settings
 */
export default class SettingService {

    public static setDefaults(activationContext: vscode.ExtensionContext){
      const conf = vscode.workspace.getConfiguration();

      if (conf.get("OPAL.opal.targetDir") === "") {
          conf.update("OPAL.opal.targetDir", vscode.workspace.rootPath, true);
      }
      if (conf.get("OPAL.opal.librariesDir") === "") {
          conf.update("OPAL.opal.librariesDir", vscode.workspace.rootPath, true);
      }
      if (conf.get("OPAL.server.jar") === "") {
          console.log(activationContext.extensionPath);
          let jarPath = ""+activationContext.extensionPath;
          var files = fs.readdirSync(jarPath);
          for(let i = 0; i < files.length; i++){
            if(files[i].includes("stg.java-bytecode-workbench")){
              jarPath = jarPath+"/"+files[i]+"/"; 
            }
          }
          files = fs.readdirSync(jarPath);
          for(let i = 0; i < files.length; i++){
            if(files[i].includes("OPAL Command Server") && files[i].includes(".jar")){
              jarPath = jarPath+"/"+files[i]; 
            }
          }
          console.log("OPAL Command Server jar at "+jarPath);
          conf.update("OPAL.server.jar", jarPath, true);
      }
    }

    public static getCurrentVersion(activationContext: vscode.ExtensionContext) : string {
      let version : string;
      version = "";
      var packageJsonFile = JSON.parse(fs.readFileSync(npmPath.join
              (activationContext.extensionPath, "package.json"), 'utf8'));

      if (packageJsonFile) {
        version = packageJsonFile.version;
        console.log("Active Extension Version: " + packageJsonFile.version);
      } else {
        console.log("Something went wrong with fetching the active version, setting it statically...");
        console.log("This could cause setting errors which require manually changing settings.");
        let extension : vscode.Extension<any>;
        extension = <any>vscode.extensions.getExtension("java-bytecode-workbench");
        if(extension){
          version = extension.packageJSON.version;
        } else {
          vscode.window.showErrorMessage(
            "Error at configuring settings. Please do so manually. Check ReadMe for more information."
          );
        }
      }
      return version;
    }

    public static checkContent(){
        const conf = vscode.workspace.getConfiguration();

        if (conf.get("OPAL.opal.targetDir") === "" || conf.get("OPAL.opal.librariesDir") === "" || conf.get("OPAL.server.jar") === "") {
            vscode.window.showErrorMessage(
              "If this is your first startup: Please restart VSCode."
            );
            vscode.window.showErrorMessage(
              "If your already restarted, please setup manually. Check the extensions readme for more information."
            );
        }
    }
}