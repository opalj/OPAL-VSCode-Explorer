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
        let tmp = workspace.asRelativePath(ClassDAO._classes[0].uri.fsPath);
        let tmp2 = workspace.asRelativePath(classURI.path);
        tmp = tmp.slice(tmp.indexOf("\\"));
        
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

    public async addClassByURI(classPath : Uri) {
        let fileName = npmPath.parse(classPath.fsPath).base;
        
        let className = "";
        if (fileName.includes(".class") || fileName.includes(".java")) {
            className = fileName.replace(".class", "").replace(".java", "");
        } else {
            throw new Error("Can't get Class Name from "+fileName);
        }

        let fqn = await this._contextService.loadFQNFromContext(classPath.fsPath);

        let result : ClassFile = {"name" : className, "uri" : classPath, "fqn" : fqn};
        ClassDAO._classes.push(result);
    }

    public async addClassesFromWorkspace() {
        let classes = await workspace.findFiles("**/*.class");
        classes.forEach(classItem => {
            this.addClassByURI(classItem);
        });
    }

    public async updateClassesFolder (folderPath : Uri) {
        let classes = await workspace.findFiles(new RelativePattern(folderPath.fsPath, "**/*.class"));
        ClassDAO._classes = [];
        classes.forEach(classItem => {
            this.addClassByURI(classItem);
        });
    }
}