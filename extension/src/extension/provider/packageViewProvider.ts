import * as vscode from 'vscode';

import { Package } from "./package";

var readdirp = require('readdirp');



export class PackageViewProvider implements vscode.TreeDataProvider<Package> {

	private _onDidChangeTreeData: vscode.EventEmitter<Package | undefined> = new vscode.EventEmitter<Package | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Package | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;
	private _treeRoot: Package;
	private _tree: Package[];

	constructor(projectFolder: vscode.Uri) {
		this._projectFolder = projectFolder;
		this._tree = [];
		this._treeRoot = this.setPackageTree(this._projectFolder);
		
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(p: Package): vscode.TreeItem {
		return p;
	}

	public getChildren(p?: Package): Thenable<Package[]> {
		if(p){
			if (p.hasSubPackages()) {
			return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
			}
		} else {
			vscode.window.showInformationMessage('Kein Subpackage enthalten!');
			return Promise.resolve([]);
		}
		

	}

	public setPackageTree(root : vscode.Uri)  : Package {
		var settings = {
			root: this._projectFolder.fsPath,
			entryType: 'directory'
		};

		var paths: string[];
		paths = [];

		function pushPaths(fileInfo : any){
			paths.push(
				<string> fileInfo.fullPath
			);
			vscode.window.showInformationMessage(<string> fileInfo.fullPath);
		}

		function callback(err : any, res : any) {
			if(err){
				console.log(err);
			} else {
				console.log("Recursive Search successfull");
			}
		}

		readdirp(settings, pushPaths, callback);

		for(let i = 0; i < paths.length; i++){
			let relPath : string;
				relPath = paths[i];
			let name = <any> (relPath.split("/").reverse().pop);
			this._tree[i] = new Package(name, vscode.TreeItemCollapsibleState.Collapsed, relPath);
		}

		for(let i = 0; i < this._tree.length; i++){
			let subPackages: Package[];
			subPackages = [];
			for(let j = 0; j < this._tree.length; j++){
				if(!(i === j) && this._tree[j].getPath().includes(this._tree[i].getPath())){
					if(this._tree[j].getPath().replace(this._tree[j].getPath(), "").split("/").length === 1){
						subPackages.push(this._tree[j]);
					}
				}
			}
			this._tree[i].setChildren(subPackages);
		}
		return this._tree[0];
	}
}