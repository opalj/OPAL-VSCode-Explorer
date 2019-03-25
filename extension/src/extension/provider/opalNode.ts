import * as vscode from 'vscode';

export class OpalNode extends vscode.TreeItem {

	private _path: string;
	private _children: OpalNode[];
	private _parent: OpalNode | undefined;

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
		if(label.includes("class")){
			this.contextValue = "opalNodeClass";
			this.setChildren([new OpalNode("TAC", vscode.TreeItemCollapsibleState.None, path.concat("/TAC"),
											{
												command: 'extension.menuTac',
												title: '',
												arguments: [vscode.Uri.parse(path)]
											}
			),
			new OpalNode("BC", vscode.TreeItemCollapsibleState.None, path.concat("/BC"),
											{
												command: 'extension.menuBC',
												title: '',
												arguments: [vscode.Uri.parse(path)]
											}
			)]);
		} else if(label=== "TAC"){
			this.contextValue = "opalNodeTac";
		} else if(label === "BC"){
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

	public getName() : string{
		return this.label;
	}

	public setName(name : string) {
		super.label = name;
		if(this.label.includes("class") || this.label.includes(".classpath")){
			this.contextValue = "opalNodeFile";
		} else {
			this.contextValue = "opalNodePackage";
		}
	}

	public getPath() : string{
		return this._path;
	}

	public getChildren() : OpalNode[] {
		return this._children;
	}

	public setChildren(children : OpalNode[]) {
		this._children = children;
	}

	public getParent() : OpalNode | undefined {
		return this._parent;
	}

	public setParent(parent : OpalNode) {
		this._parent = parent;
	}

	hasSubOpalNodes() : boolean {
		if(this._children.length === 0){
			return false;
		} else {
			return true;
		}
		
	}
}