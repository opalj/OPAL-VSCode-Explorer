import * as vscode from 'vscode';
import * as fs from 'fs';
import { Package } from "./package";

var readdirp = require('readdirp');



export class PackageViewProvider implements vscode.TreeDataProvider<Package> {

	private _onDidChangeTreeData: vscode.EventEmitter<Package | undefined> = new vscode.EventEmitter<Package | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Package | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;

	constructor(projectFolder: vscode.Uri) {
		this._projectFolder = projectFolder;
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(package: Package): vscode.TreeItem {
		return package;
	}

	public getChildren(package?: Package): Thenable<Package[]> {
		if (this.hasSubPackages(package)) {
			return Promise.resolve(this.getSubPackages(package));
		} else {
			return Promise.resolve([]);
		}

	}

	hasSubPackages(package : Package | undefined){
		if(package){
			return false;
		} else {
			return false;
		}
	}

	getSubPackages(package){
		let a = [new Package("test", vscode.TreeItemCollapsibleState.Collapsed);
		return a;
	}

	public getPackageTree(root : vscode.Uri) {
		var settings = {
			root: this._projectFolder.fsPath,
			entryType: 'all'
		};

		var paths: String[];

		function pushPaths(fileInfo : any) {
			paths.push(
				<String> fileInfo.fullPath
			);
		}

		function callback(err : any, res : any) {
			if(err){
				throw err;
			} else {
				return paths;
			}
		}

		readdirp(settings, pushPaths, callback);
	}
}