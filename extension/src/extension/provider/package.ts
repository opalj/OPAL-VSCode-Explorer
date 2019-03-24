import * as vscode from 'vscode';

export class Package extends vscode.TreeItem {

	private _path: string;
	private _children: Package[];

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		path: string
	) {
		super(label, collapsibleState);
		this._children = [];
		this._path = path;
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

	hasSubPackages() : boolean {
		if(this._children.length === 0){
			return false;
		} else {
			return true;
		}
	}

	contextValue = 'package';
}