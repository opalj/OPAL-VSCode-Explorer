// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TacService } from './extension/service/tac.service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	
	console.log('Congratulations, your extension "opal-vscode-explorer" is now active!');

	let tacCommand = vscode.commands.registerCommand('extension.tac', async () => {
		let tacID = await vscode.window.showInputBox({ placeHolder: 'TAC ID ...' });
		if (tacID) {
			var tacService = new TacService('http://localhost:8080/tac/');
			vscode.window.showInformationMessage('TAC requested from Server ..... ');
			tacService.loadTAC(tacID).then(function (res: any) {
				vscode.window.showInformationMessage(res.tac);
			});
		} else {
			vscode.window.showInformationMessage('ERROR: something wrong with the TAC ID');
		}
	});

	context.subscriptions.push(tacCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
