import { TreeItem, TreeItemCollapsibleState } from "vscode";
import OpalNode from "./opalNode";


export default class RootNode extends TreeItem {
    private _children: OpalNode[];

    constructor() {
        super("Project Root", TreeItemCollapsibleState.Expanded);
        this._children = [];
    }

    /**
	 * method to get children nodes
	 */
	public getChildren() : OpalNode[] {
		return this._children;
	}

	/**
	 * method to set children nodes
	 * @param children children nodes
	 */
	public setChildren(children : OpalNode[]) {
		this._children = children;
	}

	public addChildren(child : OpalNode) {
		this._children.push(child);
	}
}