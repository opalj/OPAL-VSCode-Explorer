/**
import * as vscode from 'vscode';
import { OpalNode } from "./opalNode";
import { CommandService } from '../service/command.service';
import OpalConfig from '../opal.config';
 */
export default class OpalNodeProvider {
    
    /**
     * this method expects the path to a jar file
     * and returns the relative (to this jar) paths of all included
     * class files (containing file name and file extension!)
     */
    public static getClassesFromJar(jarPath : string) : string[] {
        //ToDo
        return ["Class1", "Class2"];
    }

    /**
     * this method expects the path to a class file (inside and 
     * relative to a a jar) and returns an Array of its methods
     * 
     */
    public static getMethodsForClass(classPath : string) : string[] {
        //ToDo
        return ["Method1", "Method2", "Method3"];
    }
}