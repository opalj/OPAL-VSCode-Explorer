// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import { workspace, languages, window, commands, ExtensionContext, Disposable, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import { TacService } from './extension/service/tac.service';
import TACProvider, { encodeLocation } from './extension/provider/TACProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const tacProvider = new TACProvider();

	const providerRegistrations = vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider(TACProvider.scheme, tacProvider)
	);

	console.log('Congratulations, your extension "opal-vscode-explorer" is now active!');
	//registering command "Opal-TAC", p.r. to extension/package.json
	let tacCommand = vscode.commands.registerCommand('extension.tac', async () => {

		let tacID = await vscode.window.showInputBox({ placeHolder: 'TAC ID ...' });
		// Load the JavaScript grammar and any other grammars included by it async.
			if (tacID) {
				//executing TacService on Tac ID
				var tacService = new TacService('http://localhost:8080/tac/');
				vscode.window.showInformationMessage('TAC requested from Server ..... ');

				tacService.loadTAC(tacID).then(function (res: any) {
					//return Tac and show it in a Textdocument
					var setting: vscode.Uri = vscode.Uri.parse("untitled:" + "/test.txt");
					vscode.workspace.openTextDocument(setting).then((a : vscode.TextDocument) => {
						vscode.window.showTextDocument(a,1,false).then(e => { 
							e.edit(edit => {
								 edit.insert(new vscode.Position(0,0), res.tac);
							});
						 });
					});
				});
			
			} else {
				//invalid Tac ID given
				vscode.window.showInformationMessage('ERROR: something wrong with the TAC ID');
			}
		//});
		//input for Tac ID
	});

	const commandRegistration = vscode.commands.registerTextEditorCommand('editor.printReferences', editor => {
		const uri = encodeLocation(editor.document.uri, editor.selection.active);
		console.log("URI");
		console.log(uri);
		return vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc, 1));
	});

	context.subscriptions.push(tacCommand, providerRegistrations, commandRegistration);
}

// this method is called when your extension is deactivated
export function deactivate() {}
