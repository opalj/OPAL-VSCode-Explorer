import AbstractDocument from './abstract.document';
import * as vscode from "vscode";
import { ParamsConverterService } from "../service/params.converter.service";
import * as npmPath from "path";

export default class BCDocument extends AbstractDocument {
 
  public parseDocumentLinks() : vscode.DocumentLink[] {
    /*
    const parser = new LinkParser(this._uri, this._content);
    parser.parseJumps();
    return parser.getLinks();
    */
   return [];
  }
 
  public async loadContent(projectId: string, target: vscode.Uri, targetsRoot : string): Promise<any> {
        //Extract Filename from URI
        var fileName = npmPath.parse(target.fsPath).base;

        if (fileName.includes(".class")) {
          fileName = fileName.replace(".class", "");
          if (targetsRoot) {
            ParamsConverterService.targetsRoot = targetsRoot;
          } 
          var fqn = ParamsConverterService.getFQN(
            target.fsPath
          );
          
          try {
            let bcObject = await this._commandService.loadAnyCommand("getBCForClass", projectId, {"fqn" : fqn, "className" : fileName});
            bcObject = this.parseBCJson(bcObject);
            return Promise.resolve(this.readableByteCode(bcObject, fqn));
          } catch (e) {
            console.log(e);
          }
        } else {
          return "";
        }
  }

  parseBCJson(bcJSON : any) : any {
    let bcObject : any = {
      "methods" : []
    };
    for (let method in bcJSON) {
      let methodBC : any = {};
      methodBC.name = method;
      methodBC.instructions = [];

      const regex = /\((.*?)\)/g;
      let instructions;
      while ((instructions = regex.exec(bcJSON[method])) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (instructions.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          let instruction = instructions[0].split(",");
          instruction[0] = instruction[0].replace(/\(+/g, "");
          methodBC.instructions.push(instruction);
      }
      bcObject.methods.push(methodBC);
    }
    return bcObject;
  }

  readableByteCode(bc : any, fqn : string) {
    let res = "Byte Code of "+ fqn + "\n";
    
    bc.methods.forEach((method: any) => {
      res += method.name + "\n{\n";
      method.instructions.forEach((instruction: any) => {
        res += "\t"+instruction.join(":")+"\n";
      });
      res += "\n}\n";
    });
    
   return res;
  }
}
