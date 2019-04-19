import * as vscode from "vscode";
import * as npmPath from "path";
import ContextService from "../service/context.service";
import { workspace, Uri, RelativePattern } from 'vscode';

export interface ClassFile {
    name : string;
    uri : Uri;
    methods? : Method[];
    fqn : string;
}

interface Method {
    name : string;
    descriptor : string;
}

export default class ClassDAO {

    private static _classes : ClassFile[] = [];
    private _contextService : ContextService;

    constructor(contextService : ContextService) {
        this._contextService = contextService;
    }

    getClassForURI(classURI : Uri) : ClassFile {
        let res = ClassDAO._classes.find((item) =>
            workspace.asRelativePath(item.uri.fsPath) === workspace.asRelativePath(classURI.fsPath)
        );
        if (res !== undefined) {
            return res;
        } else {
            throw new Error("Class" + classURI.fsPath+" not found.");
        }
    }

    public getFSpaths() : string[] {
        let res : string[] = [];
        ClassDAO._classes.forEach(classItem => {
            res.push(classItem.uri.fsPath);
        });
        return res;
    }

    get classes() {
        return ClassDAO._classes;
    }

    public async addClass(classItem : ClassFile) {
        ClassDAO._classes.push(classItem);
    }

    public async addClassByURI(classPath : Uri) {
        let fileName = npmPath.parse(classPath.fsPath).base;
        
        let className = "";
        if (fileName.includes(".class") || fileName.includes(".java")) {
            className = fileName.replace(".class", "").replace(".java", "");
        } else {
            throw new Error("Can't get Class Name from "+fileName);
        }

        let context = await this._contextService.loadFQNFromContext(classPath.fsPath);
        context = JSON.parse(context);
        let methods = JSON.parse(context.methods);

        let result : ClassFile = {"name" : className, "uri" : classPath, "fqn" : context.fqn, "methods" : methods};
        ClassDAO._classes.push(result);
    }

    public async addClassesFromWorkspace() {
        let classes = await workspace.findFiles("**/*.class");
        vscode.window.showInformationMessage(classes.length + " class files found!");
        for (let classItem of classes) {
            await this.addClassByURI(classItem);
        }
    }

    public async updateClassesFolder (folderPath : Uri) {
        let classes = await workspace.findFiles(new RelativePattern(folderPath.fsPath, "**/*.class"));
        ClassDAO._classes = [];
        
        for (let classItem of classes) {
            await this.addClassByURI(classItem);
        }
    }
}