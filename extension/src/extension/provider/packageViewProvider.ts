import * as vscode from 'vscode';
import { Package } from "./package";

const dirTree = require("directory-tree");

export class PackageViewProvider implements vscode.TreeDataProvider<Package> {

	private _onDidChangeTreeData: vscode.EventEmitter<Package | undefined> = new vscode.EventEmitter<Package | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Package | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;
	private _treeRoot: Package;

	constructor(projectFolder: vscode.Uri) {
		this._projectFolder = projectFolder;
		let rootRes = this.setPackageTree(this._projectFolder.fsPath);
		if(rootRes){
			this._treeRoot = rootRes;
		} else {
			this._treeRoot = new Package(<any>projectFolder.fsPath.split("/").reverse().pop(), 
											vscode.TreeItemCollapsibleState.Collapsed, 
											projectFolder.fsPath);
		}
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(p: Package): vscode.TreeItem | Thenable<vscode.TreeItem>{
		return p;
	}

	public getChildren(p?: Package): vscode.ProviderResult<Package[]> {
		console.log(p);
		if(p){
			if (p.hasSubPackages()) {
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
				vscode.window.showInformationMessage('Kein Subpackage enthalten!');
			}
		} else {
			let p = this.setPackageTree(this._projectFolder.fsPath);
			if(p){
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
			}
			
		}
	}

	public getParent(p: Package): vscode.ProviderResult<Package>{
		return new Promise(p.getParent);
	}

	public setPackageTree(root : string)  : Package | undefined {
		 
		const tree = dirTree(root, {normalizePath:true});
		var subPackages: Package[];
		subPackages = [];
		if(tree.type === "directory"){
			for(let i = 0; i < tree.children.length; i++){
				
				if(tree.children[i].type === "directory"){
					let resTmp = this.setPackageTree(tree.children[i].path);
					if(resTmp){
						subPackages.push(resTmp);
					}
				}
			}
			let res : Package;
				res = new Package(tree.name, vscode.TreeItemCollapsibleState.Collapsed, tree.path);
				res.setChildren(subPackages);
				for(let i = 0; i < res.getChildren().length; i++){
					res.getChildren()[i].setParent(res);
				}
				return res;
		} 		
	}
}