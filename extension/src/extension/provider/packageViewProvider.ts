import * as vscode from 'vscode';
import { OpalNode } from "./opalNode";

//dirTree for recursively reading directories and its contents
const dirTree = require("directory-tree");

/**
 * Class for providing Opal Tree View
 */
export class PackageViewProvider implements vscode.TreeDataProvider<OpalNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<OpalNode | undefined> = new vscode.EventEmitter<OpalNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<OpalNode | undefined> = this._onDidChangeTreeData.event;
	private _projectFolder : vscode.Uri;
	private _treeRoot: OpalNode;

	/**
	 * Constructor for PackageViewProvider
	 * @param projectFolder root folder uri
	 */
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

	/**
	 * method for refreshing tree view
	 */
	public refresh(): void {
		this._onDidChangeTreeData.fire();
		this._treeRoot = <any> this.setOpalNodeTree(this._projectFolder.fsPath);
	}

	/**
	 * method for getting tree root item
	 */
	public getTreeRoot(): OpalNode {
		return this._treeRoot;
	}

	/**
	 * necessary method for getting tree item from constructs
	 * @param p construct
	 */
	public getTreeItem(p: OpalNode): vscode.TreeItem | Thenable<vscode.TreeItem>{
		return p;
	}

	/**
	 * necessary method for getting children of tree item or construct
	 * @param p construct or tree item
	 */
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

	/**
	 * necessary method for getting parent of tree item or constructs
	 * @param p construct or tree item
	 */
	public getParent(p: OpalNode): vscode.ProviderResult<OpalNode>{
		return new Promise(p.getParent);
	}

	/**
	 * Set OpalNodes for Subtree of root path
	 * @param root root path
	 */
	public setOpalNodeTree(root : string)  : OpalNode | undefined {
		//iterate over directory content
		const tree = dirTree(root, {normalizePath:true});
		var subOpalNodes = [];
		subOpalNodes = [];
		if(tree.type === "directory"){
			for(let i = 0; i < tree.children.length; i++){
				//Push children onto subOpalNodes array
				if(tree.children[i].type === "directory"){
					let resTmp = this.setOpalNodeTree(tree.children[i].path);
					if(resTmp){
						subOpalNodes.push(resTmp);
					}
				}else if(tree.children[i].type === "file"){
					if(tree.children[i].extension === ".class"){
						let resTmp = new OpalNode(tree.children[i].name, vscode.TreeItemCollapsibleState.Collapsed, tree.children[i].path);
						subOpalNodes.push(resTmp);
					} else if(tree.children[i].extension === ".jar"){
						let resTmp = new OpalNode(tree.children[i].name, vscode.TreeItemCollapsibleState.Collapsed, tree.children[i].path);
						subOpalNodes.push(resTmp);
					}
				}
			}
			//create OpalNode for root
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