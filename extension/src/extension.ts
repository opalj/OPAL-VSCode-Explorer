import * as vscode from "vscode";
import TACProvider from "./extension/provider/tac.provider";
import { ProjectService } from "./extension/service/project.service";
import * as npmPath from "path";
import { PackageViewProvider } from "./extension/provider/packageViewProvider";
import { encodeLocation } from "./extension/provider/abstract.provider";
import ClassDAO, { ClassFile } from "./extension/model/class.dao";
import ContextService from "./extension/service/context.service";
import { CommandService } from "./extension/service/command.service";
import OpalNode from "./extension/model/opalNode";

const fs = require("file-system");
const isReachable = require("is-reachable");

const TACScheme = "tac"; /* eslint-disable-line naming-convention */
// const BCScheme = "bc";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  /**
   * Get the current Project ID
   * The Project ID is the fs Path to the Project
   */
  const projectId = await getProjectId();
  const extensionPath = context.extensionPath;

  /**
   * Setup and get the Config
   */
  const conf = vscode.workspace.getConfiguration();
  const serverURL =
    "http://localhost:" + conf.get("JavaBytecodeWorkbench.server.port");
  /**
   * Get the Class Data Access Object
   */
  const contextService = new ContextService(serverURL);
  const classDAO = new ClassDAO(contextService);

  /**
   * Get the Providers and register them to there scheme
   */
  const tacProvider = new TACProvider(projectId, conf, classDAO);
  // const bcProvider = new BCProvider(projectId, conf, classDAO);
  const providerRegistrations = vscode.Disposable.from(
    vscode.workspace.registerTextDocumentContentProvider(
      TACProvider.scheme,
      tacProvider
    ),
    vscode.languages.registerDocumentLinkProvider(
      { scheme: TACProvider.scheme },
      tacProvider
    )
  );

  const projectService: any = new ProjectService(
    serverURL,
    projectId,
    classDAO
  );

  /**
   * ######################################################
   * ################# Connect to Jetty ###################
   * ######################################################
   */
  // Ping Jetty
  let jettyIsUp = await isReachable(
    "localhost:" + conf.get("JavaBytecodeWorkbench.server.port")
  );

  if (!jettyIsUp) {
    // search server jar file
    let jarPath = "" + context.extensionPath;

    //read content of extension folder path
    const files = fs.readdirSync(jarPath);
    let found = false;
    //search for Opal Command Server jar
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].includes("OPAL") &&
        files[i].includes("Command") &&
        files[i].includes("Server") &&
        files[i].includes(".jar")
      ) {
        //if found, add it to jar path
        jarPath = jarPath + "/" + files[i];
        found = true;
      }
    }

    if (!found) {
      vscode.window.showErrorMessage("Server jar File not found!");
      return;
    }

    // Jetty is not Up
    // start Jetty
    const jettyTerminal = vscode.window.createTerminal("jetty");
    jettyTerminal.hide();
    jettyTerminal.sendText(
      "java -jar '" +
        jarPath +
        "' " +
        conf.get("JavaBytecodeWorkbench.server.parameter"),
      true
    );
  }

  /**
   * Show some progress to the User while Jetty is booting
   */
  vscode.window.withProgress(
    {
      cancellable: false,
      location: 15,
      title: "OPAL Java Bytecode Project Server is starting  ...",
    },
    async (progress, token) => {
      progress.report({ increment: 0 });
      let i = 0;
      while (!jettyIsUp) {
        await delay(100);
        jettyIsUp = await isReachable(
          "localhost:" + conf.get("JavaBytecodeWorkbench.server.port")
        );
        progress.report({ increment: i * 10 });
        i++;
      }
      return Promise.resolve();
    }
  );

  /*
   * Wait for Jetty being started
   */
  await delay(500);
  while (!jettyIsUp) {
    await delay(200);
    jettyIsUp = await isReachable(
      "localhost:" + conf.get("JavaBytecodeWorkbench.server.port")
    );
  }

  vscode.window.showInformationMessage(
    "Connected to OPAL Java Bytecode Project Server"
  );

  /**
   * After Jetty is up we can load the class Files from the Workspace
   * Jetty is necessary for this because we need OPAL to get the fqn
   * from a class File
   */
  await classDAO.addClassesFromWorkspace();

  // Get status bar
  let myStatusBarItem: vscode.StatusBarItem;
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  /**
   * ######################################################
   * ################# Load Project #######################
   * ######################################################
   */
  let projectIsLoaded = false;
  const loadProjectCommand = vscode.commands.registerCommand(
    "extension.loadProject",
    async () => {
      // Project can not be loaded if jetty is not op
      const jettyIsUp = await isReachable(
        "localhost:" + conf.get("JavaBytecodeWorkbench.server.port")
      );
      if (!jettyIsUp) {
        vscode.window.showErrorMessage("Server is not up!");
        return;
      }

      if (projectIsLoaded) {
        return;
      }
      vscode.window.showInformationMessage("Loading Project");

      // get output channel where we can show the opal logs
      const outputChannel = vscode.window.createOutputChannel("OPAL");
      outputChannel.appendLine("Loading Project ...");
      outputChannel.show();

      /**
       *  Load Project in to OPAL
       */
      // get opal init message
      const opalLoadMessage = await projectService.getOPALLoadMessage({
        "jdk.load": conf.get("JavaBytecodeWorkbench.extension.jdk.load") + "",
        "jdk.loadAsLib":
          conf.get("JavaBytecodeWorkbench.extension.jdk.loadAsLib") + "",
        libraryClassFilesAreInterfacesOnly:
          conf.get(
            "JavaBytecodeWorkbench.extension.jdk.loadAsLibInterfacesOnly"
          ) + "",
        libFolders: conf.get("JavaBytecodeWorkbench.extension.libFolders"),
      });

      // let opal load the project (this may take a while)
      projectService.load(opalLoadMessage).then(function (response: any) {
        if (response !== "") {
          myStatusBarItem.text = response;
          myStatusBarItem.show();
          vscode.window.showInformationMessage(response);
          projectIsLoaded = true;
        }
      });

      // get log message
      const logMessage = await projectService.getLogMessage("init", {});

      // get logging while opal is loading the project
      let oldLog = "";
      while (!projectIsLoaded) {
        await delay(100);
        // show the logs in the status bar
        const log = await projectService.requestLOG(logMessage);
        if (log !== undefined && oldLog !== log) {
          myStatusBarItem.text = log;
          outputChannel.appendLine(log);
          outputChannel.show();
          oldLog = log;
        }
        // wait for new logs
        await delay(1000);
      }
    }
  );

  /**
   * ######################################################
   * ################# Reload Project #####################
   * ######################################################
   */
  const reloadProjectCommand = vscode.commands.registerCommand(
    "extension.reloadProjectCommand",
    async () => {
      await projectService.unLoad();
      projectIsLoaded = false;
      await vscode.commands.executeCommand("extension.loadProject");
    }
  );

  /**
   * ######################################################
   * ################### Commands #########################
   * ######################################################
   */
  const customCommand = vscode.commands.registerCommand(
    "extension.customCommand",
    async () => {
      // debug TAC for static TAC files:
      // 1. get id for tac file
      const customCommandStr = await vscode.window.showInputBox({
        placeHolder: "command:param",
      });
      if (customCommandStr === undefined) {
        vscode.window.showErrorMessage("Command is undefined!");
      } else {
        /**
         * command[0] => command
         * command[1] => parameter
         */
        const command = customCommandStr.split(":");

        if (command[0] === "tac") {
          // default TAc
          // 2. create a virtual uri for the menuTAC command parameter
          const uri = vscode.Uri.parse("class://custom/" + command[1]);
          const fqn = command[1].split(".");
          const classItem: ClassFile = {
            name: fqn[fqn.length - 1],
            uri: uri,
            fqn: fqn.join("/"),
          };
          classDAO.addClass(classItem);

          vscode.commands.executeCommand("extension.menuTac", uri);
        }
      }
    }
  );

  //menu-command to get tac from .class
  const menuTacCommand = vscode.commands.registerCommand(
    "extension.menuTac",
    async (uri: vscode.Uri) => {
      /**
       * Get URI for a virtual TAC Document
       */
      const tacURI = encodeLocation(uri, projectId, TACScheme);

      /**
       * Get a virtual TAC Document from TAC Provider (see provider/tac.provider.ts);
       */
      const tacDoc = await vscode.workspace.openTextDocument(tacURI);
      /**
       * Open virtual TAC Document.
       * This will fire the value() Method in the tac.document.ts and issue a HTTP request to the OPAL Server
       */
      vscode.window.showTextDocument(tacDoc);
    }
  );
  // an other variant of the TAC
  const menuTacSsaLike = vscode.commands.registerCommand(
    "extension.menuTacSsaLike",
    async (uri: vscode.Uri) => {
      /**
       * Get URI for a virtual TAC Document
       */
      const tacURI = encodeLocation(
        uri,
        projectId,
        TACScheme,
        "lazyDetachedTACai"
      );
      /**
       * Get a virtual TAC Document from TAC Provider (see provider/tac.provider.ts);
       */
      const tacDoc = await vscode.workspace.openTextDocument(tacURI);
      /**
       * Open virtual TAC Document.
       * This will fire the value() Method in the tac.document.ts and issue a HTTP request to the OPAL Server
       */
      vscode.window.showTextDocument(tacDoc);
    }
  );

  const openedBCs: vscode.WebviewPanel[] = [];
  //menu-command to get bc from .class
  const menuBCCommand = vscode.commands.registerCommand(
    "extension.menuBC",
    async (uri: vscode.Uri) => {
      const fileName = npmPath.parse(uri.fsPath).base + ".bc";
      const openedBC = openedBCs.find(
        (openedBC) => openedBC.title === fileName
      );
      if (openedBC !== undefined) {
        // bc is already opened
        // show already opened bc
        openedBC.reveal();
      } else {
        // create a new web view panel
        const panel = vscode.window.createWebviewPanel(
          "Byte-Code-HTML",
          fileName,
          vscode.ViewColumn.One,
          {}
        );
        panel.webview.html = "<h1>Loading Bytecode ...</h1>";
        await vscode.commands.executeCommand("extension.loadProject");
        const classItem = classDAO.getClassForURI(uri);
        const commandService = new CommandService(serverURL);
        const bcHTML = await commandService.loadAnyCommand(
          "getBCForClassHTML",
          projectId,
          { className: classItem.fqn, fileName: classItem.uri.fsPath }
        );

        panel.onDidDispose((event) => {
          openedBCs.splice(openedBCs.indexOf(panel), 1);
        });
        // and set content to it
        panel.webview.html = bcHTML;

        // add it to the opened byte code panels
        openedBCs.push(panel);
      }
    }
  );

  const openWorkbenchCommand = vscode.commands.registerCommand(
    "extension.openWorkbenchCommand",
    async (classFile: ClassFile) => {
      const extensionPath = "" + context.extensionPath;
      const uri = vscode.Uri.file(
        extensionPath + "/src/extension/webview/index.html"
      );
      // let onDiskPath = vscode.Uri.file(extensionPath+"src/extension/webview/like_button.js").with({ scheme: 'vscode-resource' });
      // console.log(onDiskPath);
      vscode.workspace.openTextDocument(uri).then((document) => {
        const html = document.getText();

        // create a new web view panel
        const panel = vscode.window.createWebviewPanel(
          "Workbench",
          "Workbench",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );
        panel.webview.html = html;
        panel.webview.onDidReceiveMessage((event) => {
          console.log(event);
          vscode.commands.executeCommand(event.command, classFile.uri);
        });
        console.log(classFile);
        panel.onDidChangeViewState((event) => {
          if (panel.active) {
            panel.webview.postMessage({ classFile: classFile });
          }
        });
        panel.webview.postMessage({ classFile: classFile });
      });
    }
  );

  //menu-command to extract jar file
  const menuJarCommand = vscode.commands.registerCommand(
    "extension.menuJar",
    async (uri: vscode.Uri) => {
      vscode.window.showInformationMessage("Extracting Jar ...");

      //get folder und filename
      const jarFolder = npmPath.parse(uri.fsPath).dir;
      const fileName = npmPath.parse(uri.fsPath).base;
      vscode.window.showInformationMessage(fileName);

      //open new terminal
      const jarTerminal = vscode.window.createTerminal("Jar Extractor");
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

  //menu-command to add a directory to the library directory paths (settings)
  // @deprecated this is not used anymore
  const menuLibDirCommand = vscode.commands.registerCommand(
    "extension.menuLibDir",
    async (uri: vscode.Uri) => {
      vscode.window.showInformationMessage(
        "Adding Directory to Library Directory Paths..."
      );
      console.log(
        "Adding " + uri.fsPath.replace(/\\/g, "\\\\") + " to LibDirs."
      );

      const oldDirs = <string>conf.get("OPAL.librariesDirs");
      const newDirs = oldDirs + ";" + uri.fsPath;
      await conf.update("OPAL.librariesDirs", newDirs, true);
    }
  );

  /**
   * Open .class File
   *
   * Left click on a class File should open the BC of the Class
   * Since this is not easily possible out of the box we use this little hack
   */
  vscode.workspace.onDidOpenTextDocument(
    async (document: vscode.TextDocument) => {
      if (document.languageId === "class") {
        // if a class file is opened close it
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
        // open the Bytecode for this class file
        await vscode.commands.executeCommand("extension.menuBC", document.uri);
      }
    }
  );

  vscode.window.onDidChangeWindowState((event) => {
    const active = vscode.window.activeTextEditor;
    console.log(active);
  });

  /**
   * Setting up and displaying Opal Tree View
   */
  OpalNode.extensionPath = extensionPath;
  const packageViewProvider = new PackageViewProvider(classDAO);
  packageViewProvider.refresh();

  //register Opal Tree View
  vscode.window.registerTreeDataProvider(
    "package-explorer",
    packageViewProvider
  );

  //add commands to this extension's context
  context.subscriptions.push(
    menuTacCommand,
    menuBCCommand,
    menuJarCommand,
    menuLibDirCommand,
    providerRegistrations,
    loadProjectCommand,
    reloadProjectCommand,
    customCommand,
    myStatusBarItem,
    menuTacSsaLike,
    openWorkbenchCommand
  );

  vscode.window.showInformationMessage("Java Bytecode Workbench is ready.");
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * Method for issuing delay
 * @param ms delay in ms
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Method for getting current Project ID
 */
async function getProjectId() {
  const wsFolders = vscode.workspace.workspaceFolders;
  if (wsFolders !== undefined) {
    let path = wsFolders[0].uri.fsPath;
    //Remove Backslashes for further usage as String
    path = path.replace(/\\/g, "/");
    return path;
  } else {
    return "";
  }
}
