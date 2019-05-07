import * as vscode from 'vscode';
import OpalNode from "./../model/opalNode";
import RootNode from "./../model/rootNode";

import ClassDAO, { ClassFile }  from '../model/class.dao';
import { TreeItem } from 'vscode';

//dirTree for recursively reading directories and its contents
//const dirTree = require("directory-tree");

/**
 * Class for providing Opal Tree View
 */
export class PackageViewProvider implements vscode.TreeDataProvider<OpalNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<OpalNode | undefined> = new vscode.EventEmitter<OpalNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<OpalNode | undefined> = this._onDidChangeTreeData.event;
	
	private _treeRoot: TreeItem;
	public targetsRoot : string = "";
	private _classDAO : ClassDAO;

	/**
	 * Constructor for PackageViewProvider
	 */
	constructor(classDAO : ClassDAO) {
		this._classDAO = classDAO;
		this._treeRoot = new RootNode();
	}

	/**
	 * method for refreshing tree view
	 */
	public refresh(): void {
		this._onDidChangeTreeData.fire();
		this._treeRoot = this.setOpalNodeTree(this._classDAO.classes);
	}

	/**
	 * method for getting tree root item
	 */
	public getTreeRoot(): TreeItem {
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
			}
		} else {
			let p = this.setOpalNodeTree(this._classDAO.classes);
			if(p){
				return Promise.resolve((p as OpalNode).getChildren());
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
	public setOpalNodeTree(classes : ClassFile[])  : TreeItem  {
		let rootNode = new RootNode();
		if (classes.length === 0) {
			vscode.window.showErrorMessage("No classes found!");
			return rootNode;
		} else {
			this._treeRoot = rootNode;
		}
		
		classes.forEach(async target => {
			let fqnParts = target.fqn.split("/");
			
			fqnParts.forEach(fqnPart => {
				this.addNode(this._treeRoot, fqnParts, target, 0);
			});			
		});
		return this._treeRoot;
	}

	private searchNode(root : OpalNode, label : string) : OpalNode | null {
		if (root.label === label) {
			return root;
		} else {
			let foundNode = null;
			root.getChildren().forEach((child: TreeItem) => {
				if (child.label === label) {
					foundNode = child;
				}
			});
			return foundNode;
		}
	}

	private addNode(opalNode : TreeItem, fqnParts : string[], classFile : ClassFile, i : number) {
		var parent = this.searchNode(opalNode as OpalNode, fqnParts[i]);
		if (parent !== null) {
			// this is a grantParent of the node we try to add
			i = i+1;
			this.addNode(parent, fqnParts, classFile, i);
		} else {
			// this is the parent of the node we try to add
			// we can add the node to the children
			if (fqnParts[i] !== undefined) {
				let type = i === fqnParts.length-1 ? "leaf" : "node";
				let newNode = new OpalNode(fqnParts[i], vscode.TreeItemCollapsibleState.Collapsed, classFile, type);
				(opalNode as OpalNode).addChildren(newNode);
			}
		}
	}
}