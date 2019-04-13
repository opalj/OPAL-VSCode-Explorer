import * as vscode from "vscode";
import { CommandService } from "../service/command.service";
import { ClassFile } from "../model/class.dao";

export default abstract class AbstractDocument { // should implements vscode.TextDocument 
  uri: vscode.Uri;
  fileName: string = "";
  isUntitled: boolean = false;
  languageId: string = "";
  version: number = 1;
  isDirty: boolean = false;
  isClosed: boolean = false;
  save(): Thenable<boolean> {
    throw new Error("Method not implemented.");
  }
  //eol: vscode.EndOfLine;
  //lineCount: number;
  //lineAt(line: number): vscode.TextLine;
  //lineAt(position: vscode.Position): vscode.TextLine;
  lineAt(position: any) {
    throw new Error("Method not implemented.");
  }
  offsetAt(position: vscode.Position): number {
    throw new Error("Method not implemented.");
  }
  positionAt(offset: number): vscode.Position {
    throw new Error("Method not implemented.");
  }
  getText(range?: vscode.Range | undefined): string {
    throw new Error("Method not implemented.");
  }

  /**
   * Links for the jumps to references
   */
  private _links: vscode.DocumentLink[];
  protected _commandService: CommandService;
  protected _content: string;
  protected _projectId: string;
  protected _classFileURI: vscode.Uri;
  private _opalConfig: any;
  protected targetsRoot : string = "";
  protected _class : ClassFile;

  constructor(
    uri: vscode.Uri,
    projectId: string,
    classFileURI: vscode.Uri,
    config: any,
    classItem : ClassFile
  ) {
    this._links = [];
    this._opalConfig = config;
    this._commandService = new CommandService(
      "http://localhost:" + this._opalConfig.get("OPAL.server.port")
    );


    //this._emitter = emitter;
    this.uri = uri;

    this._projectId = projectId;
    this._classFileURI = classFileURI;
    this._class = classItem;
    this._content = "";
  }

  /**
   * Get the TAC Code of this TAC Document
   * MUST RETURN A STRING
   */
  get value() {
    return this._content;
  }

  get links() {
    return this._links;
  }

  /**
   * Get the Data of this document
   */
  public async populate() {
    try {
      let tac = this.loadContent();
      tac.then((result : string) => this._content = result);
      return tac;
    } catch (e) {
      console.log(e);
    }
  }

  public abstract loadContent() : Promise<string>;

  public abstract parseDocumentLinks(content : string) :  vscode.DocumentLink[];
}
