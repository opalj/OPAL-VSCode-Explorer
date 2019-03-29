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
        let jarPath = ""+osHomedir+"/.vscode/extensions/stg.java-bytecode-workbench-"
                        +version+"/OPAL Command Server-assembly-0.1.0-SNAPSHOT.jar";
        conf.update("OPAL.server.jar", jarPath, true);
    }
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