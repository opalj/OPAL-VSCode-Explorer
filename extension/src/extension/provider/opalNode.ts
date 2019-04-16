import * as vscode from 'vscode';
//import OpalNodeProvider from "./opalNodeProvider";

/**
 * Class representing OpalNode
 */
export class OpalNode extends vscode.TreeItem {

	// private _classFile: vscode.Uri;
	private _children: OpalNode[];
	private _parent: OpalNode | undefined;
	

	/**
	 * Constructor for OpalNode
	 * @param label name label
	 * @param collapsibleState	collapsibleState, Collapsed, Not or None 
	 * @param classFile Uri of the class File
	 * @param type
	 * @param command on-click command
	 */
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public classFile: vscode.Uri,
		public type: string,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this._children = [];
		
		/**
		 * Setting contextValues and static Subnodes in
		 * Depencency of data type
		 */
		if(this.type === "leaf"){
			this.contextValue = "opalNodeClass";
			this.setChildren([
				new OpalNode("Three-Address-Code Naive", vscode.TreeItemCollapsibleState.None, classFile, "action",
					{
						command: 'extension.menuTac',
						title: '',
						arguments: [classFile]
					}
				),
				new OpalNode("Three-Address-Code SSA like", vscode.TreeItemCollapsibleState.None, classFile, "action",
				{
					command: 'extension.menuTacDetached',
					title: '',
					arguments: [classFile]
				}),
				new OpalNode("Bytecode", vscode.TreeItemCollapsibleState.None, classFile, "action",
				{
					command: 'extension.menuBC',
					title: '',
					arguments: [classFile]
				}
			),	
			]);
		} else if(label=== "Three-Address-Code"){
			this.contextValue = "opalNodeTac";
		} else if(label === "Bytecode"){
			this.contextValue = "opalNodeBC";
		} else {
			this.contextValue = "opalNodePackage";
		}
	}

	/** 
	iconPath = {
		light: "assets/expicon.svg",
		dark: "assets/expicon.svg"
	};*/

	/**
	 * get name/label node
	 */
	public getName() : string{
		return this.label;
	}

	/**
	 * set name/label of node
	 * @param name new name/label
	 */
	public setName(name : string) {
		super.label = name;
		if(this.label.includes("class") || this.label.includes(".classpath")){
			this.contextValue = "opalNodeFile";
		} else {
			this.contextValue = "opalNodePackage";
		}
	}

	/**
	 * method to get path of node data
	 */
	public getPath() : string{
		return this.classFile.fsPath;
	}

	/**
	 * method to get children nodes
	 */
	public getChildren() : OpalNode[] {
		return this._children;
	}

	/**
	 * method to set children nodes
	 * @param children children nodes
	 */
	public setChildren(children : OpalNode[]) {
		this._children = children;
	}

	public addChildren(child : OpalNode) {
		this._children.push(child);
	}

	/**
	 * method to get parent node
	 */
	public getParent() : OpalNode | undefined {
		return this._parent;
	}

	/**
	 * method to set parent node
	 * @param parent parent node
	 */
	public setParent(parent : OpalNode) {
		this._parent = parent;
	}

	/**
	 * method to get status of children nodes:
	 * true, if existent; false, if not
	 */
	hasSubOpalNodes() : boolean {
		if(this._children.length === 0){
			return false;
		} else {
			return true;
		}
	}
}