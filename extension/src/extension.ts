// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TacService } from './extension/service/tac.service';
import { InitService } from './extension/service/init.service';

//var config = require('./../.vscode/opal.config.json');
var jettyStarted = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	/**
	 * Open opal.config.json
	 */
	var rootPath = vscode.workspace.rootPath;
	var path: vscode.Uri = vscode.Uri.parse("file:///"+rootPath+"/opal.config.json");
	var document = await vscode.workspace.openTextDocument(path);
	var config = JSON.parse(document.getText());

	/**
	 * If jetty not already started, start jetty
	 */
	if (!jettyStarted) {
		jettyStarted = true;
		var terminal = vscode.window.createTerminal("jetty");
		terminal.show(false);
		terminal.sendText("java -jar "+config.extension.jettyjar, true);
	}

	/**
	 * Initialize OPAL
	 */
	var initService : any = new InitService(config.server.url);
	initService.init(config.opal);
	
	

	console.log('Congratulations, your extension "opal-vscode-explorer" is now active!');
	//registering command "Opal-TAC", p.r. to extension/package.json
	let tacCommand = vscode.commands.registerCommand('extension.tac', async () => {
		//input for Tac ID
		let tacID = await vscode.window.showInputBox({ placeHolder: 'TAC ID ...' });
		if (tacID) {
			//executing TacService on Tac ID
			var tacService = new TacService(config.server.url);
			vscode.window.showInformationMessage('TAC requested from Server ..... ');
			tacService.loadTAC(tacID).then(function (res: any) {
				//return Tac in info box
				vscode.window.showInformationMessage(res.tac);
			});
		} else {
			//invalid Tac ID given
			vscode.window.showInformationMessage('ERROR: something wrong with the TAC ID');
		}
	});

	context.subscriptions.push(tacCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
