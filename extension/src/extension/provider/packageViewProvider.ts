import * as vscode from 'vscode';
import { opalNode } from "./opalNode";

const dirTree = require("directory-tree");

export class PackageViewProvider implements vscode.TreeDataProvider<opalNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<opalNode | undefined> = new vscode.EventEmitter<opalNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<opalNode | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;
	private _treeRoot: opalNode;

	constructor(projectFolder: vscode.Uri) {
		this._projectFolder = projectFolder;
		let rootRes = this.setopalNodeTree(this._projectFolder.fsPath);
		if(rootRes){
			this._treeRoot = rootRes;
		} else {
			this._treeRoot = new opalNode(<any>projectFolder.fsPath.split("/").reverse().pop(), 
											vscode.TreeItemCollapsibleState.Collapsed, 
											projectFolder.fsPath);
		}
	}

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem(p: opalNode): vscode.TreeItem | Thenable<vscode.TreeItem>{
		return p;
	}

	public getChildren(p?: opalNode): vscode.ProviderResult<opalNode[]> {
		console.log(p);
		if(p){
			if (p.hasSubopalNodes()) {
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
				vscode.window.showInformationMessage('Kein SubopalNode enthalten!');
			}
		} else {
			let p = this.setopalNodeTree(this._projectFolder.fsPath);
			if(p){
				return Promise.resolve(p.getChildren());
			} else {
				return Promise.resolve([]);
			}
			
		}
	}

	public getParent(p: opalNode): vscode.ProviderResult<opalNode>{
		return new Promise(p.getParent);
	}

	public setopalNodeTree(root : string)  : opalNode | undefined {
		 
		const tree = dirTree(root, {normalizePath:true});
		console.log(tree);
		var subopalNodes = [];
		subopalNodes = [];
		if(tree.type === "directory"){
			for(let i = 0; i < tree.children.length; i++){
				
				if(tree.children[i].type === "directory"){
					let resTmp = this.setopalNodeTree(tree.children[i].path);
					if(resTmp){
						subopalNodes.push(resTmp);
					}
				}else if(tree.children[i].type === "file" && (tree.children[i].extension === ".class" ||
																tree.children[i].name === ".classpath")) {
					let resTmp = new opalNode(tree.children[i].name, vscode.TreeItemCollapsibleState.Collapsed, tree.children[i].path);
					subopalNodes.push(resTmp);
				}
			}

			let res : opalNode;
				res = new opalNode(tree.name, vscode.TreeItemCollapsibleState.Collapsed, tree.path);
				res.setChildren(subopalNodes);
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