import { ClassFile } from "../model/class.dao";


export default class ClassWorkbenchHTML {
    private classFile : ClassFile;

    constructor(classFile : ClassFile) {
        this.classFile = classFile;
    }

    buildMethodsTable() : string {
        let html = "<table>";
        html += "<tr>";
        html += "<td>Method</td>";
        // html += "<td>Method Descriptor</td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "<td></td>";
        html += "</tr>";
        let methods = this.classFile.methods;
        if (methods !== undefined) {
            
            methods.forEach(method => {
                html += "<tr>";
                html += "<td>"+method+"</td>";
                // html += "<td>"+method.descriptor+"</td>";
                html += "<td><a href=''>TAC Naive</a></td>";
                html += "<td><a href=''>TAC SSA like</a></td>";
                html += "<td><a href=''>Bytecode</a></td>";
                html += "</tr>";
            });
        }
        html += "</table>";
        return html;
    }

    loadContent() {
        let html = "<!DOCTYPE html><html lang='en'><head></head><body>";
        html += "<h3>Methods</h3>";
        html += this.buildMethodsTable();
        html += "</body>";
        return html;
    }
}