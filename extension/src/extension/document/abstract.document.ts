import * as vscode from "vscode";
import { CommandService } from "../service/command.service";
import { ClassFile } from "../model/class.dao";

export default abstract class AbstractDocument {
  /**
   * Links for the jumps to references
   */
  private _links: vscode.DocumentLink[];
  protected _commandService: CommandService;
  
  //private _emitter: vscode.EventEmitter<vscode.Uri>;
  protected _uri: vscode.Uri;
  protected _content: string;
  protected _projectId: string;
  protected _target: vscode.Uri;
  private _opalConfig: any;
  protected targetsRoot : string = "";
  protected _class : ClassFile;

  constructor(
    uri: vscode.Uri,
    projectId: string,
    target: vscode.Uri,
    config: any,
    classItem : ClassFile
  ) {
    this._links = [];

    this._opalConfig = config;
    this._commandService = new CommandService(
      "http://localhost:" + this._opalConfig.get("OPAL.server.port")
    );


    //this._emitter = emitter;
    this._uri = uri;

    this._projectId = projectId;
    this._target = target;
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
