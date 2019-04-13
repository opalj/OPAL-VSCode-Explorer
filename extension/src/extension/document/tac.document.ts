import AbstractDocument from './abstract.document';
import * as vscode from "vscode";
import { ClassFile } from "../model/class.dao";


export default class TACDocument extends AbstractDocument {

  public version : string;

  constructor(
    uri: vscode.Uri,
    projectId: string,
    target: vscode.Uri,
    config: any,
    classItem : ClassFile,
    verison = ""
  ) {
    super(uri, projectId, target, config, classItem);
    this.version = verison;
  }

  public loadContent() {
    return this._commandService.loadTAC(this._commandService.getTACForClassMessage(this._projectId, this._class.fqn, this._class.name, this.version));
  }
 
  public parseDocumentLinks(tac : string) : vscode.DocumentLink[] {
    const parser = new LinkParser(this._uri, tac);
    parser.parseJumps();
    return parser.getLinks();
  }

}

enum LineType {
  MethodStart,
  MethodEnd,
  GOTO,
  Caller,
  Irrelevant
}

export class LinkParser {
  private links: vscode.DocumentLink[];
  private tacLines: string[];
  private lineTypes: LineType[];
  private docPath: vscode.Uri;

  constructor(docPath: vscode.Uri, tac: string) {
    this.links = [];
    this.tacLines = tac.split("\n");
    this.lineTypes = [LineType.Irrelevant, this.tacLines.length];
    this.docPath = docPath;
  }

  /**
   * parseJumps
   */
  public parseJumps() {
    this.analyzeLine();
    let lastMethodStart: number = 0;
    let start = 0;
    let end = 0;
    for (let i = this.tacLines.length - 1; i >= 0; i--) {
      switch (this.lineTypes[i]) {
        case LineType.Caller:
          let tmp = <RegExpExecArray>this.matchCaller(this.tacLines[i]);
          for (let j = 1; j < tmp.length; j++) {
            let originRange: vscode.Range;
            start = this.tacLines[i].indexOf(tmp[j]);
            if (start < 0) {
              continue;
            } // // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ java.io.IOException →
            end = start + tmp[j].length;
            originRange = new vscode.Range(
              new vscode.Position(i, start),
              new vscode.Position(i, end)
            );
            let targetUri: vscode.Uri;
            let targetLine = <number>this.getTargetLineAbove(i, Number(tmp[j]));
            targetUri = this.docPath.with({ fragment: String(targetLine) });
            this.documentLinkComposer(originRange, targetUri);
          }
          break;
        case LineType.GOTO:
          let gArray = <RegExpExecArray>this.matchGOTO(this.tacLines[i]);
          let gOriginRange: vscode.Range;

          start = this.tacLines[i].indexOf(gArray[0]);
          if (start < 0) {
            continue;
          }
          end = start + gArray[0].length;

          gOriginRange = new vscode.Range(
            new vscode.Position(i, start),
            new vscode.Position(i, end)
          );

          let gTargetUri: vscode.Uri;
          let gTargetLine = <number>(
            this.getTargetLineGlobal(i, Number(gArray[1].replace("goto ", "")))
          );
          //gTargetUri = vscode.Uri.parse(this.docPath.toString().concat(":"+String(gTargetLine)+":0"));
          gTargetUri = this.docPath.with({ fragment: String(gTargetLine) });

          this.documentLinkComposer(gOriginRange, gTargetUri);
          break;
        case LineType.MethodStart:
          lastMethodStart = i;
          break;
        case LineType.MethodEnd:
          let eOriginRange: vscode.Range;
          eOriginRange = new vscode.Range(
            new vscode.Position(i, 0),
            new vscode.Position(i, 1)
          );

          let eTargetUri: vscode.Uri;
          //eTargetUri = vscode.Uri.parse(this.docPath.toString().concat(":"+String(lastMethodStart)+":0"));
          eTargetUri = this.docPath.with({ fragment: String(lastMethodStart) });

          this.documentLinkComposer(eOriginRange, eTargetUri);
          break;
        case LineType.Irrelevant:
          break;
        default:
          console.log("Something went wrong!");
          break;
      }
    }
  }

  private documentLinkComposer(
    originRange: vscode.Range,
    targetUri: vscode.Uri
  ) {
    this.links.push(new vscode.DocumentLink(originRange, targetUri));
  }

  private analyzeLine() {
    for (let i = this.tacLines.length - 1; i >= 0; i--) {
      if (this.isCaller(this.tacLines[i])) {
        this.lineTypes[i] = LineType.Caller;
      } else if (this.isGOTO(this.tacLines[i])) {
        this.lineTypes[i] = LineType.GOTO;
      } else if (this.isMethodStart(this.tacLines[i])) {
        this.lineTypes[i] = LineType.MethodStart;
      } else if (this.isMethodEnd(this.tacLines[i])) {
        this.lineTypes[i] = LineType.MethodEnd;
      } else {
        this.lineTypes[i] = LineType.Irrelevant;
      }
    }
  }

  public isMethodStart(tacLine: string) {
    return tacLine.indexOf("){") >= 0 && tacLine.indexOf("}") === -1;
  }

  public isMethodEnd(tacLine: string) {
    return tacLine.indexOf("}") >= 0 && tacLine.indexOf("{") === -1;
  }

  public matchGOTO(tacLine: string) {
    const regex = /goto (\d+)/gm;
    let res = regex.exec(tacLine);
    if (res !== null) {
      return res;
    }
  }

  private isGOTO(tacLine: string): boolean {
    const regex = /goto (\d+)/gm;
    return regex.test(tacLine);
  }

  public matchCaller(tacLine: string) {
    const regex = /\/\/(.*?)→/gm;
    let res = regex.exec(tacLine);
    let tmp: string[];
    if (res !== null) {
      res[1] = res[1].split(" ").join("");
      tmp = res[1].split(",");
      for (let i = 0; i < tmp.length; i++) {
        res[i + 1] = tmp[i];
      }
      return res;
    }
  }

  private isCaller(tacLine: string): boolean {
    const regex = /\/\/(.*?)→/gm;
    return regex.test(tacLine);
  }

  public matchLineIndex(tacLine: string) {
    const regex = /\b(\d+):/gm;
    let m = regex.exec(tacLine);
    if (m !== null) {
      return m[1].replace(new RegExp(":", "g"), "");
    }
  }

  private sameMethod(line1: number, line2: number): any {
    if (line1 === line2) {
      return true;
    } else if (this.isMethodEnd(this.tacLines[line1])) {
      return false;
    }
    if (line1 < line2) {
      return this.sameMethod(line1 + 1, line2);
    }
    if (line1 > line2) {
      return this.sameMethod(line2, line1);
    }
  }

  private getTargetLineAbove(originLine: number, targetID: number) {
    for (let i = originLine - 1; i >= 0; i--) {
      if (
        targetID === parseInt(<string>this.matchLineIndex(this.tacLines[i]))
      ) {
        if (this.sameMethod(i, originLine)) {
          return i + 1;
        }
      }
    }
  }

  private getTargetLineGlobal(originLine: number, targetID: number) {
    for (let i = this.tacLines.length - 1; i >= 0; i--) {
      if (
        targetID === parseInt(<string>this.matchLineIndex(this.tacLines[i]))
      ) {
        if (this.sameMethod(i, originLine)) {
          return i + 1;
        }
      }
    }
  }

  public getLinks(): vscode.DocumentLink[] {
    return this.links;
  }
}
