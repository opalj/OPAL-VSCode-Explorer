import * as vscode from 'vscode';
import OpalNodeProvider from "./opalNodeProvider";

/**
 * Class representing OpalNode
 */
export class OpalNode extends vscode.TreeItem {

	private _path: string;
	private _children: OpalNode[];
	private _parent: OpalNode | undefined;

	/**
	 * Constructor for OpalNode
	 * @param label name label
	 * @param collapsibleState	collapsibleState, Collapsed, Not or None 
	 * @param path data path
	 * @param command on-click command
	 */
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		path: string,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this._children = [];
		this._path = path;
		this._parent = undefined;
		/**
		 * Setting contextValues and static Subnodes in
		 * Depencency of data type
		 */
		if(label.includes(".class")){
			this.contextValue = "opalNodeClass";
			this.setChildren([new OpalNode("Three-Address-Code", vscode.TreeItemCollapsibleState.None, path.concat("/TAC"),
											{
												command: 'extension.menuTac',
												title: '',
												arguments: [vscode.Uri.parse(path)]
											}
			),
			new OpalNode("Bytecode", vscode.TreeItemCollapsibleState.None, path.concat("/BC"),
											{
												command: 'extension.menuBC',
												title: '',
												arguments: [vscode.Uri.parse(path)]
											}
			)]);
		} else if(label.includes(".jar")){
			this.contextValue = "opalNodeJar";
			let classes: string[];
			classes = OpalNodeProvider.getClassesFromJar(path);
			let childArray: OpalNode[];
			childArray = [];
			for(let i = 0; i < classes.length; i++){
				childArray.push(new OpalNode("Class: "+classes[i], vscode.TreeItemCollapsibleState.Collapsed, classes[i]));
			}
			this._children = childArray;
		} else if(label.includes("Class:")){
			this.contextValue = "opalNodeJarClass";
			let methods: string[];
			methods = OpalNodeProvider.getMethodsForClass(path);
			let childArray: OpalNode[];
			childArray = [];
			for(let i = 0; i < methods.length; i++){
				childArray.push(new OpalNode("Method: "+methods[i], vscode.TreeItemCollapsibleState.Collapsed, methods[i]));
			}
			this._children = childArray;
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
		return this._path;
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