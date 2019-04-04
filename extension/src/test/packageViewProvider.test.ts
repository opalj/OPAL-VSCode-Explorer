// var expect = require('chai').expect;
import { PackageViewProvider } from './../extension/provider/packageViewProvider';

suite("OPAL Package View Provider", function () {
    this.timeout(20000);
    test("build nodes by targets", (done) => {
        var targets : any = [
            "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\opal\\extension\\vscode\\model\\OpalCommand.class",
            "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\streams\\$global\\assemblyOption\\$global\\streams\\assembly\\66527c4e1da5d9830724d0f8d9bb177c9bd24a61_dir\\opal\\extension\\vscode\\model\\OpalInit$.class",
            "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\streams\\$global\\assemblyOption\\$global\\streams\\assembly\\66527c4e1da5d9830724d0f8d9bb177c9bd24a61_dir\\opal\\extension\\vscode\\model\\TACForClass.class"
        ];
        var packageViewProvider = new PackageViewProvider(targets, "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\");
        var opalNodes = packageViewProvider.setOpalNodeTree(targets, "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\");
        console.log(opalNodes);
    });
});
