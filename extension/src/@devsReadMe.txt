Stump for implementing TreeView for Jars, its Classes, their Methods:
- src/extension/provider/packageViewProvider.ts
    - Privder for Tree View
        - setOpalNodeTree() Method recursivly scans directory for interesting files and creates nodes for them.
        - new filetypes can be added as nodes, the same way it is done for class and jar files
- src/extension/provider/opalNode.ts
    - OpalNodes, the tree is made of 
    - new childnode patterns can be added, the same way it is done for .class or .jar nodes
    - in line 72, the children for jar methods are set. Every child node can own a command, which is triggered
    if the node is selected. See .class files children as an example.
- src/extension/provider/opalNodeProvider.ts
    - contains method stumps for getting necessary data from opal