import * as vscode from 'vscode';

export class Package extends vscode.TreeItem {

	private _path: string;
	private _children: Package[];
	private _parent: Package | undefined;

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

	public getPath() : string{
		return this._path;
	}

	public getChildren() : Package[] {
		return this._children;
	}

	public setChildren(children : Package[]) {
		this._children = children;
	}

	public getParent() : Package | undefined {
		return this._parent;
	}

	public setParent(parent : Package) {
		this._parent = parent;
	}

	hasSubPackages() : boolean {
		if(this._children.length === 0){
			return false;
		} else {
			return true;
		}
	}

	contextValue = 'package';
}