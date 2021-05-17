import * as vscode from "vscode";
import * as npmPath from "path";
import ContextService from "../service/context.service";
import { workspace, Uri, RelativePattern } from "vscode";

export interface ClassFile {
  name: string;
  uri: Uri;
  methods?: Method[];
  fqn: string;
}

export interface Method {
  name: string;
  descriptor: string;
  accessFlag: number;
  toJava: string;
}

export default class ClassDAO {
  private static _classes: ClassFile[] = [];
  private _contextService: ContextService;

  constructor(contextService: ContextService) {
    this._contextService = contextService;
  }

  getClassForURI(classURI: Uri): ClassFile {
    const res = ClassDAO._classes.find(
      (item) =>
        workspace.asRelativePath(item.uri.fsPath) ===
        workspace.asRelativePath(classURI.fsPath)
    );
    if (res !== undefined) {
      return res;
    } else {
      throw new Error("Class" + classURI.fsPath + " not found.");
    }
  }

  public getFsPaths(): string[] {
    const res: string[] = [];
    ClassDAO._classes.forEach((classItem) => {
      res.push(classItem.uri.fsPath);
    });
    return res;
  }

  get classes() {
    return ClassDAO._classes;
  }

  public async addClass(classItem: ClassFile) {
    ClassDAO._classes.push(classItem);
  }

  public async addClassFromContext(classContext: any) {
    const fileName = npmPath.parse(classContext.path).base;

    let className = "";
    if (fileName.includes(".class") || fileName.includes(".java")) {
      className = fileName.replace(".class", "").replace(".java", "");
    } else {
      throw new Error("Can't get Class Name from " + fileName);
    }

    const result: ClassFile = {
      name: className,
      uri: Uri.file(classContext.path),
      fqn: classContext.fqn,
      methods: classContext.methods,
    };
    ClassDAO._classes.push(result);
  }

  public async addClassByURI(classPath: Uri) {
    const fileName = npmPath.parse(classPath.fsPath).base;

    let className = "";
    if (fileName.includes(".class") || fileName.includes(".java")) {
      className = fileName.replace(".class", "").replace(".java", "");
    } else {
      throw new Error("Can't get Class Name from " + fileName);
    }

    let context = await this._contextService.loadFQNFromContext(
      classPath.fsPath
    );
    context = JSON.parse(context);
    const methods = JSON.parse(context.methods);

    const result: ClassFile = {
      name: className,
      uri: classPath,
      fqn: context.fqn,
      methods: methods,
    };
    ClassDAO._classes.push(result);
  }

  public async addClassesFromWorkspace() {
    const classes = await workspace.findFiles("**/*.class");
    const classItems = await this._contextService.loadFQNFromContextBULK(
      classes
    );
    vscode.window.showInformationMessage(
      classes.length + " class files found!"
    );
    for (const classItem of classItems) {
      await this.addClassFromContext(classItem);
    }
  }

  public async updateClassesFolder(folderPath: Uri) {
    const classes = await workspace.findFiles(
      new RelativePattern(folderPath.fsPath, "**/*.class")
    );
    ClassDAO._classes = [];

    for (const classItem of classes) {
      await this.addClassByURI(classItem);
    }
  }
}
