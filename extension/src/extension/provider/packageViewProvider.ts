import * as vscode from 'vscode';
import { OpalNode } from "./opalNode";
import { ParamsConverterService } from './../service/params.converter.service';
import { ProjectService } from '../service/project.service';

//dirTree for recursively reading directories and its contents
//const dirTree = require("directory-tree");

/**
 * Class for providing Opal Tree View
 */
export class PackageViewProvider implements vscode.TreeDataProvider<OpalNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<OpalNode | undefined> = new vscode.EventEmitter<OpalNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<OpalNode | undefined> = this._onDidChangeTreeData.event;
	
	private _treeRoot: OpalNode;
	// private _targets : any =  [];
	private _targetsRoot : string = "";

	private _projectService : ProjectService;

	/**
	 * Constructor for PackageViewProvider
	 * @param projectFolder root folder uri
	 */
	constructor(projectService : ProjectService, targetsRoot : string) {
		// let rootRes = this.setOpalNodeTree(targets, targetsRoot);
		// this._targets = targets;
		this._targetsRoot = targetsRoot;
		/*
		if(rootRes){
			this._treeRoot = rootRes;
		} else {
			this._treeRoot = new OpalNode("No classes found!", vscode.TreeItemCollapsibleState.None, "");
		}
		*/
		this._projectService = projectService;
		this._treeRoot = new OpalNode("No classes found!", vscode.TreeItemCollapsibleState.None, "", "");
	}

	/**
	 * method for refreshing tree view
	 */
	public refresh(): void {
		this._onDidChangeTreeData.fire();
		this._treeRoot = <any> this.setOpalNodeTree(this._projectService.targetAsStrings(), this._targetsRoot);
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
			let p = this.setOpalNodeTree(this._projectService.targetAsStrings(), this._targetsRoot);
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
	public setOpalNodeTree(targets : string[], targetsRoot : string)  : OpalNode | undefined {
		if (targets.length === 0) {
			vscode.window.showErrorMessage("Workspace root is Empty!");
			return undefined;
		}
		
		this._treeRoot = new OpalNode("Root Node", vscode.TreeItemCollapsibleState.None, "", "");
		targets.forEach(target => {
			let fqn = ParamsConverterService.getFQN(target, targetsRoot);
			let fqnParts = fqn.split("/");
			
			fqnParts.forEach(fqnPart => {
				this.addNode(this._treeRoot, fqnParts, target, 0);
			});			
		});
		return this._treeRoot;
	}

	private searchNode(root : OpalNode, label : string) : OpalNode | null {
		if (root.getName() === label) {
			return root;
		} else {
			let foundNode = null;
			root.getChildren().forEach(child => {
				if (child.getName() === label) {
					foundNode = child;
				}
			});
			return foundNode;
		}
	}

	private addNode(opalNode : OpalNode, fqnParts : string[], target : string, i : number) {
		var parent = this.searchNode(opalNode, fqnParts[i]);
		if (parent !== null) {
			// this is a grantparent of the node we try to add
			i = i+1;
			this.addNode(parent, fqnParts, target, i);
		} else {
			// this is the parent of the node we try to add
			// we can add the node to the childs
			if (fqnParts[i] !== undefined) {
				let type = i === fqnParts.length-1 ? "leaf" : "node";
				let newNode = new OpalNode(fqnParts[i], vscode.TreeItemCollapsibleState.Collapsed, target, type);
				opalNode.addChildren(newNode);
			}
		}
	}
}