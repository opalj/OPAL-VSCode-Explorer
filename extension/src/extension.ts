// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TacService } from './extension/service/tac.service';
import { ProjectService } from './extension/service/project.service';

const isReachable = require('is-reachable');

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
	// Ping Jetty
	var jettyIsUp = await isReachable(config.server.url);
	if (!jettyIsUp) {
		var terminal = vscode.window.createTerminal("jetty");
		terminal.show(false);
		if (config.extension.hasOwnProperty("serverJarPath") && config.extension.serverJarPath !== "") {
			terminal.sendText("java -jar '" + config.extension.serverJarPath + "' " + config.extension.jarOptions, true);
		} else {
			var jarPath = config.extension.extensionFolder + "/" + config.extension.jarFileName;
			terminal.sendText("java -jar '" + jarPath + "' " + config.extension.jarOptions, true);
		}
	}

	/*
	 * Wait for Jetty being started
	 */
	while (!jettyIsUp) {
		await delay(100);
		jettyIsUp = await isReachable("localhost:8080");
	}

	/**
	 * Load Project in OPAL
	 */
	// Get status bar
	let myStatusBarItem: vscode.StatusBarItem;
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	context.subscriptions.push(myStatusBarItem);

	// get project Service
	var projectloaded = false;
	var projectService : any = new ProjectService(config.server.url);
	// get opal init message
	var opalInitMessage = await projectService.getOPALInitMessage(config.opal.targetsDir, config.opal.librariesDir, config.opal.config);

	// let opal load the project (this may take a while)
	projectService.load(opalInitMessage).then(function () {
		console.log("Project loaded!");
		myStatusBarItem.text = "Project loaded!";
		myStatusBarItem.show();
		projectloaded = true;
	});
	
	// get log message
	var logMessage = await projectService.getLogMessage("init", config.opal.config);
	// get output channel where we can show the opal logs
	const outputChannel = vscode.window.createOutputChannel("OPAL");
	// get logging while opal is loading the project
	while(!projectloaded) {
		// wait for new logs
		await delay(1000);
		// show the logs in the status bar 
		var log = await projectService.requestLOG(logMessage);
		if (log !== undefined) {
			myStatusBarItem.text = "OPAL: Loading Project: "+log+" ... ";
			myStatusBarItem.show();
			outputChannel.appendLine("[OPAL]: "+log);
			outputChannel.show();
			console.log(log);
		} 
	}

	
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
export function deactivate() {
	
}


async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}