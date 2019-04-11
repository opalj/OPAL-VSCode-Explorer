import * as vscode from "vscode";
import { CommandService } from "../service/command.service";
import { Class } from "../model/class.dao";

export default abstract class AbstractDocument {
  /**
   * Links for the jumps to references
   */
  private _links: vscode.DocumentLink[];
  protected _commandService: CommandService;
  
  //private _emitter: vscode.EventEmitter<vscode.Uri>;
  protected _uri: vscode.Uri;
  protected _content: string;
  private _projectId: string;
  private _target: vscode.Uri;
  private _opalConfig: any;
  private targetsRoot : string = "";
  protected _class : Class;

  constructor(
    uri: vscode.Uri,
    projectId: string,
    target: vscode.Uri,
    config: any,
    classItem : Class
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
    this._content = <string>(<unknown>this._populate());
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
  private async _populate() {
    return this.loadContent(this._projectId, this._target, this.targetsRoot);
  }

  public abstract parseDocumentLinks(content : string) :  vscode.DocumentLink[];

  public abstract async loadContent(projectId: string, target: vscode.Uri, targetsRoot : string): Promise<string>;
}
