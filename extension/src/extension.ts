// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import { workspace, languages, window, commands, ExtensionContext, Disposable, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import TACProvider, { encodeTACLocation } from './extension/provider/tac.provider';
import BCProvider, { encodeBCLocation } from './extension/provider/bc.provider';
import { ProjectService } from './extension/service/project.service';
import * as npmPath from 'path';
import OpalConfig from './extension/opal.config';
import { PackageViewProvider } from './extension/provider/packageViewProvider';


const isReachable = require('is-reachable');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	/**
	 * Get the current Project ID
	 * The Project ID is the fs Path to the Project
	 */
	var projectId = await getProjectId();
	console.log(projectId);

	/**
	 * Get the config
	 */
	var config = await OpalConfig.getConfig();

	/**
	 * Get the Providers and register them to there sheme
	 */
	const tacProvider = new TACProvider(projectId, config);
	const bcProvider = new BCProvider(projectId, config);
	const providerRegistrations = vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider(TACProvider.scheme, tacProvider),
		vscode.workspace.registerTextDocumentContentProvider(BCProvider.scheme, bcProvider)
	);
	
	
	/**
	 * If jetty not already started, start jetty
	 */
	// Ping Jetty
	var jettyIsUp = await isReachable(config.server.url.replace("http://", ""));
	if (!jettyIsUp) {
		var jettyTerminal = vscode.window.createTerminal("jetty");
		jettyTerminal.show(false);
		jettyTerminal.sendText("java -jar '"+config.server.jar+"' "+config.server.jaroptions, true);
	}

	/*
	 * Wait for Jetty being started
	 */
	while (!jettyIsUp) {
		await delay(100);
		jettyIsUp = await isReachable(config.server.url.replace("http://", ""));
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
	var projectService : any = new ProjectService(config.server.url, projectId);
	// get opal init message
	var opalLoadMessage = await projectService.getOPALLoadMessage(config.opal.targetsDir, config.opal.librariesDir, config.opal.config);

	// let opal load the project (this may take a while)
	projectService.load(opalLoadMessage).then(function () {
		console.log("Project loaded!");
		myStatusBarItem.text = "Project loaded!";
		myStatusBarItem.show();
		vscode.window.showInformationMessage("Project loaded!");
		projectloaded = true;
	});
	
	// get log message
	var logMessage = await projectService.getLogMessage("init", config.opal.config);
	// get output channel where we can show the opal logs
	const outputChannel = vscode.window.createOutputChannel("OPAL");
	// get logging while opal is loading the project
	var oldLog = "";
	while(!projectloaded) {
		// wait for new logs
		await delay(1000);
		// show the logs in the status bar 
		var log = await projectService.requestLOG(logMessage);
		if (log !== undefined && oldLog !== log) {
			myStatusBarItem.text = "OPAL: Loading Project: "+log+" ... ";
			myStatusBarItem.show();
			outputChannel.appendLine("[OPAL]: "+log);
			outputChannel.show();
			oldLog = log;
			console.log(log);
		} 
	}

	//menu-command to get tac from .class
	let menuTacCommand = vscode.commands.registerCommand('extension.menuTac', async (uri:vscode.Uri) => {
		/**
		 * Get URI for a virtual TAC Document
		 */
		var tacURI = encodeTACLocation(uri, projectId);
		
		/**
		 * Get a virtual TAC Document from TAC Provider (see provider/tac.provider.ts);
		 */
		var tacDoc = await vscode.workspace.openTextDocument(tacURI);
		/**
		 * Open virtual TAC Document.
		 * This will fire the value() Method in the tac.document.ts and issue a HTTP request to the OPAL Server
		 */
		vscode.window.showTextDocument(tacDoc);
	});


	//menu-command to get bc from .class
	let menuBCCommand = vscode.commands.registerCommand('extension.menuBC', async (uri:vscode.Uri) => {
		/**
		 * Get URI for a virtual BC Document
		 */
		uri = encodeBCLocation(uri, projectId);
		
		/**
		 * Get a virtual BC Document from BC Provider (see provider/bc.provider.ts);
		 */
		var doc = await vscode.workspace.openTextDocument(uri);
		/**
		 * Open virtual TAC Document.
		 * This will fire the value() Method in the tac.document.ts and issue a HTTP request to the OPAL Server
		 */
		vscode.window.showTextDocument(doc);
	});

	//menu-command to extract jar file
	let menuJarCommand = vscode.commands.registerCommand('extension.menuJar', async (uri:vscode.Uri) => {
		vscode.window.showInformationMessage("Extracting Jar ...");
		var jarFolder = config.extension.jarExtractionFolder;
		var fileName = npmPath.parse(uri.fsPath).base;
		console.log(fileName);
		vscode.window.showInformationMessage(fileName);

		var jarTerminal = vscode.window.createTerminal("Jar Extracter");
		jarTerminal.show(false);
		jarTerminal.sendText(("mkdir " + jarFolder.replace(/\\/g, "/") + "/" + fileName.replace(".jar", "_jar")));
		jarTerminal.sendText("cd " + jarFolder.replace(/\\/g, "/") + "/" + fileName.replace(".jar", "_jar"));
		jarTerminal.sendText("jar -xf " + uri.path.replace("/", ""));
	});

	/**
	 * Setting up and displaying Opal Tree View
	 */
	const pVP = new PackageViewProvider(vscode.Uri.parse(<string> vscode.workspace.rootPath));
	vscode.window.showInformationMessage("Package Explorer is loading...");
	vscode.window.registerTreeDataProvider('package-explorer', pVP);
	vscode.window.showInformationMessage("Package Explorer is ready.");
	
	context.subscriptions.push(menuTacCommand, menuBCCommand, menuJarCommand, providerRegistrations);
}

// this method is called when your extension is deactivated
export function deactivate() {
	
}


async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function getProjectId() {
	var wsFolders =  vscode.workspace.workspaceFolders;
	if (wsFolders !== undefined) {
		var path = wsFolders[0].uri.fsPath;
		//Remove Backslashes for further usage as String
		path = path.replace(/\\/g, "/");
		return path;
	} else {
		return "";
	}
}