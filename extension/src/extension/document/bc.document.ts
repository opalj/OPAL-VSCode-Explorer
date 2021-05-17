import AbstractDocument from "./abstract.document";
import * as vscode from "vscode";

export default class BCDocument extends AbstractDocument {
  public parseDocumentLinks(): vscode.DocumentLink[] {
    /*
    const parser = new LinkParser(this._uri, this._content);
    parser.parseJumps();
    return parser.getLinks();
    */
    return [];
  }

  public async loadContent(): Promise<string> {
    return this._commandService.loadAnyCommand(
      "getBCForClass",
      this._projectId,
      { fqn: this._class.fqn, className: this._class.name }
    );
  }

  parseBCJson(bcJSON: any): any {
    const bcObject: any = {
      methods: [],
    };
    for (const methodName in bcJSON) {
      const methodBC: any = {};
      methodBC.name = methodName;
      methodBC.instructions = [];

      const regexInstr = /\((\d+),(.*?)\),|(\d+),([A-Z]+)\)\)$/gm; // regex for parsing the tuples in the byte code json like this: (0,ALOAD_0)
      let instructions;
      const method = JSON.parse(bcJSON[methodName]);
      const rawMethodInstructions = method.instructions;
      while ((instructions = regexInstr.exec(rawMethodInstructions)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (instructions.index === regexInstr.lastIndex) {
          regexInstr.lastIndex++;
        }

        if (instructions[1] !== undefined && instructions[2] !== undefined) {
          methodBC.instructions.push([instructions[1], instructions[2]]);
        } else {
          methodBC.instructions.push([instructions[3], instructions[4]]);
        }
      }

      methodBC.attributes = method.attributes;
      methodBC.exceptions = method.exceptions;

      bcObject.methods.push(methodBC);
    }
    return bcObject;
  }

  /**
   * Get the Byte Code in a readable form
   * @param bc the byte code
   * @param fqn the fqn of the class
   */
  readableByteCode(bc: any, fqn: string) {
    let res = "Byte Code of " + fqn + "\n";

    bc.methods.forEach((method: any) => {
      res += method.name + "\n{\n";
      res += "\tINSTRUCTIONS:\n";
      method.instructions.forEach((instruction: any) => {
        res += "\t\t" + instruction[0] + ":" + instruction[1] + "\n";
      });
      res += "\tATTRIBUTES:\n";
      res += "\t\t" + method.attributes;
      res += "}\n";
      res += "\tEXCEPTIONS:\n";
      res += "\t\t" + method.exceptions + "\n";
      res += "}\n";
    });

    return res;
  }
}
