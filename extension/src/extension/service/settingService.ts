import * as vscode from "vscode";
import * as npmPath from "path";
var fs = require('file-system');
const osHomedir = require('os-homedir');


/**
 * This Service helps managing the extension's settings
 */
export default class SettingService {

    public static setDefaults(activationContext: vscode.ExtensionContext){
      const conf = vscode.workspace.getConfiguration();
      console.log("User's home directory at " + osHomedir);

      if (conf.get("OPAL.opal.targetDir") === "") {
          conf.update("OPAL.opal.targetDir", vscode.workspace.rootPath, true);
      }
      if (conf.get("OPAL.opal.librariesDir") === "") {
          conf.update("OPAL.opal.librariesDir", vscode.workspace.rootPath, true);
      }
      if (conf.get("OPAL.server.jar") === "") {
          let version = this.getCurrentVersion(activationContext);
          let jarPath = ""+osHomedir+"/.vscode/extensions/stg.java-bytecode-workbench-"
                          +version+"/OPAL Command Server-assembly-0.1.0-SNAPSHOT.jar";
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

        if (conf.get("OPAL.opal.targetDir") === "") {
            vscode.window.showErrorMessage(
              "You have to configure your project folder first. Check ReadMe for more information."
            );
          }
          if (conf.get("OPAL.opal.librariesDir") === "") {
            vscode.window.showErrorMessage(
              "You have to configure your library folder first. Check ReadMe for more information."
            );
          }
          if (conf.get("OPAL.server.jar") === "") {
            vscode.window.showErrorMessage(
              "You have to configure your OPAL Command Server jar. Check ReadMe for more information."
            );
          }
    }
}