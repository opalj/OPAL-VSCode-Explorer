import * as vscode from 'vscode';

export class Package extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(label, collapsibleState);
	}

	
	iconPath = {
		light: "assets/expicon.svg",
		dark: "assets/expicon.svg"
	};

	contextValue = 'package';

}