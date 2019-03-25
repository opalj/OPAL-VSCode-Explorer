import * as vscode from 'vscode';
import { OpalNode } from "./OpalNode";

const dirTree = require("directory-tree");

export class PackageViewProvider implements vscode.TreeDataProvider<OpalNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<OpalNode | undefined> = new vscode.EventEmitter<OpalNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<OpalNode | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;
	private _treeRoot: OpalNode;

	constructor(projectFolder: vscode.Uri) {
		this._projectFolder = projectFolder;
		let rootRes = this.setOpalNodeTree(this._projectFolder.fsPath);
		if(rootRes){
			this._treeRoot = rootRes;
		} else {
			this._treeRoot = new OpalNode(<any>projectFolder.fsPath.split("/").reverse().pop(), 
											vscode.TreeItemCollapsibleState.Collapsed, 
											projectFolder.fsPath);
		}
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(p: OpalNode): vscode.TreeItem | Thenable<vscode.TreeItem>{
		return p;
	}

	public getChildren(p?: OpalNode): vscode.ProviderResult<OpalNode[]> {
		if(p){
			if (p.hasSubOpalNodes()) {
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
				vscode.window.showInformationMessage('Kein SubOpalNode enthalten!');
			}
		} else {
			let p = this.setOpalNodeTree(this._projectFolder.fsPath);
			if(p){
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
			}
		}
	}

	public getParent(p: OpalNode): vscode.ProviderResult<OpalNode>{
		return new Promise(p.getParent);
	}

	public setOpalNodeTree(root : string)  : OpalNode | undefined {
		 
		const tree = dirTree(root, {normalizePath:true});
		var subOpalNodes = [];
		subOpalNodes = [];
		if(tree.type === "directory"){
			for(let i = 0; i < tree.children.length; i++){
				
				if(tree.children[i].type === "directory"){
					let resTmp = this.setOpalNodeTree(tree.children[i].path);
					if(resTmp){
						subOpalNodes.push(resTmp);
					}
				}else if(tree.children[i].type === "file"){
					if(tree.children[i].extension === ".class"){
						let resTmp = new OpalNode(tree.children[i].name, vscode.TreeItemCollapsibleState.Collapsed, tree.children[i].path);
					subOpalNodes.push(resTmp);
				}

			}

			let res : OpalNode;
				res = new OpalNode(tree.name, vscode.TreeItemCollapsibleState.Collapsed, tree.path);
				res.setChildren(subOpalNodes);
				for(let i = 0; i < res.getChildren().length; i++){
					res.getChildren()[i].setParent(res);
				}
				/** 
				if(tree.children.length === 1 && tree.children[0].type === "directory"){
					res.setName(res.getName() + "." + res.getChildren()[0].getName());
					res.setChildren(res.getChildren()[0].getChildren());
				}*/
				return res;
		} 		
	}
}