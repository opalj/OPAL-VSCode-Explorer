// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import { workspace, languages, window, commands, ExtensionContext, Disposable, TextDocument } from 'vscode';
import * as vscode from "vscode";
import TACProvider, {
  encodeTACLocation
} from "./extension/provider/tac.provider";
import BCProvider, { encodeBCLocation } from "./extension/provider/bc.provider";
import { ProjectService } from "./extension/service/project.service";
import * as npmPath from "path";
import SVGDocument from "./extension/provider/svg.document";
import { PackageViewProvider } from "./extension/provider/packageViewProvider";
import { ParamsConverterService } from "./extension/service/params.converter.service";
let fs = require('file-system');

const isReachable = require("is-reachable");

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
   * Setup and get the Config
   */
  const conf = vscode.workspace.getConfiguration();

  /**
   * Get the Providers and register them to there sheme
   */
  const tacProvider = new TACProvider(projectId, conf, "");
  const bcProvider = new BCProvider(projectId, conf);
  const providerRegistrations = vscode.Disposable.from(
    vscode.workspace.registerTextDocumentContentProvider(
      TACProvider.scheme,
      tacProvider
    ),
    vscode.languages.registerDocumentLinkProvider(
      { scheme: TACProvider.scheme },
      tacProvider
    ),
    vscode.workspace.registerTextDocumentContentProvider(
      BCProvider.scheme,
      bcProvider
    )
  );

  var projectService: any = new ProjectService(
    "http://localhost:" + conf.get("OPAL.server.port"),
    projectId
  );

  
  /**
   * ######################################################
   * ############### Open Target Dialog ###################
   * ######################################################
   */
  let pickTargetRoot = vscode.commands.registerCommand("extension.pickTargetRoot",
    async () => {
      var openDialogOptions : vscode.OpenDialogOptions = {
        "canSelectFiles" : false,
        "canSelectFolders" : true,
        "canSelectMany" : false
      };

      let targetDir = await vscode.window.showOpenDialog(openDialogOptions);
      if (targetDir !== undefined) {
        var targets = await vscode.workspace.findFiles(new vscode.RelativePattern(targetDir[0].fsPath, "**/*.class"));
        projectService.addTargetUris(targets);
        ParamsConverterService.targetsRoot = targetDir[0].fsPath;
        tacProvider.targetsRoot = targetDir[0].fsPath;
        packageViewProvider.targetsRoot = targetDir[0].fsPath;
        packageViewProvider.refresh();
        
      }
    }
  );
  

  /*
  var targetDir = conf.get("OPAL.opal.targetDir");
  projectService.addTargets(targetDir);

  var targets = await projectService.getTargets(targetDir);

  var librariesDirs = conf.get("OPAL.opal.librariesDirs");
  var libraries = await projectService.getLibraries(librariesDirs);

  if (targets.length === 0 && libraries.length === 0) {
    vscode.window.showErrorMessage("[OPAL] No .class or .jar Files found in current Workspace. Please open a Java like Project");
    return;
  }
  */

  /**
   * ######################################################
   * ################# Connect to Jetty ###################
   * ######################################################
   */
  // Ping Jetty
  var jettyIsUp = await isReachable(
    "localhost:" + conf.get("OPAL.server.port")
  );
  if (!jettyIsUp) {
    // search server jar file
    let jarPath = ""+context.extensionPath;
          
    //read content of extension folder path
    let files = fs.readdirSync(jarPath);
    //search for Opal Command Server jar
    for(let i = 0; i < files.length; i++){
      if(files[i].includes("OPAL Command Server") && files[i].includes(".jar")){
        //if found, add it to jar path
        jarPath = jarPath+"/"+files[i]; 
      }
    }
    // Jetty is not Up
    // start Jetty
    vscode.window.showInformationMessage("Starting Jetty ...");
    var jettyTerminal = vscode.window.createTerminal("jetty");
    jettyTerminal.show(false);
    jettyTerminal.sendText(
      "java -jar '" +
      jarPath +
        "' " +
        conf.get("OPAL.server.options"),
      true
    );
  }

  /*
   * Wait for Jetty being started
   */
  while (!jettyIsUp) {
    await delay(100);
    jettyIsUp = await isReachable("localhost:" + conf.get("OPAL.server.port"));
  }
  vscode.window.showInformationMessage("Connected to Jetty");



  /**
   * ######################################################
   * ################# Load Project #######################
   * ######################################################
   */
  let loadProjectCommand = vscode.commands.registerCommand(
    "extension.loadProject",
    async () => {
      // Project can not be loaded if jetty is not op
      var jettyIsUp = await isReachable(
        "localhost:" + conf.get("OPAL.server.port")
      );
      if (!jettyIsUp) {
        vscode.window.showErrorMessage("Jetty is not up!");
        return;
      }

      /**
       * Load Project in OPAL
       */
      // Get status bar
      let myStatusBarItem: vscode.StatusBarItem;
      myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
      );
      context.subscriptions.push(myStatusBarItem);

      // get project Service
      var projectloaded = false;
      // get opal init message
      var opalLoadMessage = await projectService.getOPALLoadMessage(
        {}
      );
      // let opal load the project (this may take a while)
      projectService.load(opalLoadMessage).then(function() {
        console.log("Project loaded!");
        myStatusBarItem.text = "Project loaded!";
        myStatusBarItem.show();
        vscode.window.showInformationMessage("Project loaded!");
        projectloaded = true;
      });

      // get log message
      var logMessage = await projectService.getLogMessage("init", {});
      // get output channel where we can show the opal logs
      const outputChannel = vscode.window.createOutputChannel("OPAL");
      // get logging while opal is loading the project
      var oldLog = "";
      while (!projectloaded) {
        // wait for new logs
        await delay(1000);
        // show the logs in the status bar
        var log = await projectService.requestLOG(logMessage);
        if (log !== undefined && oldLog !== log) {
          myStatusBarItem.text = "OPAL: Loading Project: " + log + " ... ";
          myStatusBarItem.show();
          outputChannel.appendLine("[OPAL]: " + log);
          outputChannel.show();
          oldLog = log;
          console.log(log);
        }
      }
    }
  );

  /**
   * ######################################################
   * ################# Reload Project #####################
   * ######################################################
   */
  let reloadProjectCommand = vscode.commands.registerCommand(
    "extension.reloadProjectCommand",
    async () => {
      await projectService.unLoad();
      await vscode.commands.executeCommand("extension.loadProject");
    }
  );

  //menu-command to get svg for .class
  let menuSvgCommand = vscode.commands.registerCommand(
    "extension.menuSvg",
    async (uri: vscode.Uri) => {
      /**
       * Get URI for a virtual svg Document
       */

      let document = new SVGDocument(
        uri,
        new vscode.EventEmitter<vscode.Uri>(),
        projectId,
        uri,
        conf
      );

      //var svgURI = "/Users/christianott/Documents/opal-vscode-explorer/dummy/410.svg";
      //var svgDoc = await vscode.workspace.openTextDocument(svgURI);

      var text = await document.getDocText();
      let htmlforSVG =
        '<!DOCTYPE html><html lang="de"><head></head><body><div id="__svg"> ' +
        text +
        "</div></body></html>";
      const panel = vscode.window.createWebviewPanel(
        "SVG-View",
        "SVG-View",
        vscode.ViewColumn.One,
        {}
      );
      // And set its HTML content
      panel.webview.html = htmlforSVG;
    }
  );

  //menu-command to get tac from .class
  let menuTacCommand = vscode.commands.registerCommand(
    "extension.menuTac",
    async (uri: vscode.Uri) => {
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
    }
  );

  //menu-command to get bc from .class
  let menuBCCommand = vscode.commands.registerCommand(
    "extension.menuBC",
    async (uri: vscode.Uri) => {
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
    }
  );

  //menu-command to extract jar file
  let menuJarCommand = vscode.commands.registerCommand(
    "extension.menuJar",
    async (uri: vscode.Uri) => {
      vscode.window.showInformationMessage("Extracting Jar ...");

      //get folder und filename
      var jarFolder = npmPath.parse(uri.fsPath).dir;
      var fileName = npmPath.parse(uri.fsPath).base;
      console.log(fileName);
      vscode.window.showInformationMessage(fileName);

      //open new terminal
      var jarTerminal = vscode.window.createTerminal("Jar Extractor");
      jarTerminal.show(false);

      //issue commands to extract jar into the desired folder
      jarTerminal.sendText(
        "mkdir " +
          jarFolder.replace(/\\/g, "/") +
          "/" +
          fileName.replace(".jar", "_jar")
      );
      jarTerminal.sendText(
        "cd " +
          jarFolder.replace(/\\/g, "/") +
          "/" +
          fileName.replace(".jar", "_jar")
      );
      jarTerminal.sendText("jar -xf " + uri.path.replace("/", ""));
    }
  );

  /**
   * Setting up and displaying Opal Tree View
   */
  const packageViewProvider = new PackageViewProvider(projectService, ""+projectService.targetDir);
  vscode.window.showInformationMessage("Package Explorer is loading...");
  //register Opal Tree View
  vscode.window.registerTreeDataProvider("package-explorer", packageViewProvider);
  vscode.window.showInformationMessage("Package Explorer is ready.");

  //add commands to this extension's context
  context.subscriptions.push(
    menuTacCommand,
    menuBCCommand,
    menuSvgCommand,
    menuJarCommand,
    providerRegistrations,
    loadProjectCommand,
    reloadProjectCommand,
    pickTargetRoot
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * Method for issueing delay
 * @param ms delay in ms
 */
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Method for getting current Project ID
 */
async function getProjectId() {
  var wsFolders = vscode.workspace.workspaceFolders;
  if (wsFolders !== undefined) {
    var path = wsFolders[0].uri.fsPath;
    //Remove Backslashes for further usage as String
    path = path.replace(/\\/g, "/");
    return path;
  } else {
    return "";
  }
}

/*
function tansformFoldersToQuickPickItems(folders : vscode.WorkspaceFolder[] | undefined) {
  var quickPickItem : string[] = [];
  if (folders !== undefined) {
    folders.forEach(folder => {
      quickPickItem.push(folder.name);
    });
  }
  return quickPickItem;
}
*/