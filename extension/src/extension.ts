// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TacService } from './extension/service/tac.service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "opal-vscode-explorer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	let exampleComand = vscode.commands.registerCommand('extension.getTACex', () => {
		//Second Command
		//I'll try to make this command deliver a example from the server
		vscode.window.showInformationMessage('Hier könnte ihr TAC stehen');
	});

	let windowComand = vscode.commands.registerCommand('extension.subwindow', async () => {
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


	context.subscriptions.push(disposable);
	context.subscriptions.push(exampleComand);
	context.subscriptions.push(windowComand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
