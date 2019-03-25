import * as vscode from 'vscode';

export class opalNode extends vscode.TreeItem {

	private _path: string;
	private _children: opalNode[];
	private _parent: opalNode | undefined;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		path: string
	) {
		super(label, collapsibleState);
		this._children = [];
		this._path = path;
		this._parent = undefined;
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
	}

	public getPath() : string{
		return this._path;
	}

	public getChildren() : opalNode[] {
		return this._children;
	}

	public setChildren(children : opalNode[]) {
		this._children = children;
	}

	public getParent() : opalNode | undefined {
		return this._parent;
	}

	public setParent(parent : opalNode) {
		this._parent = parent;
	}

	hasSubopalNodes() : boolean {
		if(this._children.length === 0){
			return false;
		} else {
			return true;
		}
	}

	contextValue = 'opalNode';
}