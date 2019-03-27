/**
import * as vscode from 'vscode';
import { OpalNode } from "./opalNode";
import { CommandService } from '../service/command.service';
import OpalConfig from '../opal.config';
 */
export class OpalNodeProvider {
    
    /**
     * this method expects the path to a jar file
     * and returns the relative (to this jar) paths of all included
     * class files (containing file name and file extension!)
     */
    public static getClassesFromJar(jarPath : string) : string[] {
        /** let oConfig = new OpalConfig();
        oConfig.loadConfig();
        let cService = new CommandService(oConfig.getConfig().server.url);*/
            return [];
    }
}