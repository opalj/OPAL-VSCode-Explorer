import * as vscode from 'vscode';
import { ClassFile, Method } from '../model/class.dao';

/**
 * Class representing OpalNode
 */
export default class OpalNode extends vscode.TreeItem {


	protected _children: OpalNode[];
	private _parent: OpalNode | undefined;
	

	/**
	 * Constructor for OpalNode
	 * @param label name label
	 * @param collapsibleState	collapsibleState, Collapsed, Not or None 
	 * @param classFile Class File
	 * @param type
	 * @param command on-click command
	 */
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public classFile: ClassFile,
		public type: string,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this._children = [];
		
		if(this.type === "leaf"){
			this.contextValue = "opalNodeClass";
			this.setChildren([
				this.getTacNaiveLeaf(classFile),
				this.getTacSsaLike(classFile),
				this.getBytecode(classFile),	
				this.getOpenWorkbench(classFile)
			]);
			this.addMethods(classFile.methods, classFile);
			this.addFields({}, classFile);
		} else if(label=== "Three-Address-Code"){
			this.contextValue = "opalNodeTac";
		} else if(label === "Bytecode"){
			this.contextValue = "opalNodeBC";
		} else {
			this.contextValue = "opalNodePackage";
		}
	}


	/**
	 * get name/label node
	 */
	public getLabel() : string{
		return this.label;
	}

	/**
	 * set name/label of node
	 * @param name new name/label
	 */
	public setLabel(name : string) {
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
		return this.classFile.uri.fsPath;
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

	getTacNaiveLeaf(classFile: ClassFile) {
		return new OpalNode("Three-Address-Code Naive", vscode.TreeItemCollapsibleState.None, classFile, "action",
		{
				command: 'extension.menuTac',
				title: '',
				arguments: [classFile.uri]
			}
		);
	}

	getTacSsaLike(classFile : ClassFile) {
		return new OpalNode("Three-Address-Code SSA like", vscode.TreeItemCollapsibleState.None, classFile, "action",
		{
			command: 'extension.menuTacSsaLike',
			title: '',
			arguments: [classFile.uri]
		});
	}

	getBytecode(classFile : ClassFile) {
		return new OpalNode("Bytecode", vscode.TreeItemCollapsibleState.None, classFile, "action",
		{
			command: 'extension.menuBC',
			title: '',
			arguments: [classFile.uri]
		});
	}

	getOpenWorkbench(classFile : ClassFile) {
		return new OpalNode("Workbench", vscode.TreeItemCollapsibleState.None, classFile, "action",
		{
			command: 'extension.openWorkbenchCommand',
			title: '',
			arguments: [classFile]
		});
	}

	addMethods(methods : Method[] | undefined, classFile : ClassFile) {
		let methodRoot = new OpalNode("Methods", vscode.TreeItemCollapsibleState.Collapsed, classFile, "action");
		if (methods !== undefined) {
			methods.forEach(method => {
				let methodNode = new OpalNode(method.toJava, vscode.TreeItemCollapsibleState.None, this.classFile, "action");
				methodRoot.addChildren(methodNode);
			});
		}
		this.addChildren(methodRoot);
	}

	addFields(arg0: {}, classFile: ClassFile) {
		let fieldsRoot = new OpalNode("Fields", vscode.TreeItemCollapsibleState.Collapsed, classFile, "action");
		this.addChildren(fieldsRoot);
		// not implemented!
	}
}