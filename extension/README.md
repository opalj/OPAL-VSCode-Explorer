# opal-vscode-explorer README
##Description
This extension aims to bring the advantages of [Opal-Project](http://www.opal-project.de/) into VSCode.
Such of which are Java bytecode processing, engineering, manipulation and analysis library.

##Before you start
1. Please configure the necessary settings:
..* open File > Preferences > Settings > OPAL VSCode Explorer and set the following paths as in our example
..* add "OPAL.opal.targetDir": "C:\\Users\\Documents\\Projectfolder" 
..* add "OPAL.opal.librariesDir": "C:\\Users\\Documents\\Libraries"
}

##Usage
1. VSCode file explorer context menu
..* right click a class file in your file explorer and choose "Three-Address-Code ..." to open its three-address-code
..* right click a class file in your file explorer and choose "Bytecode ..." to open its bytecode
2. Opal Explorer (lens symbol left inside the activitybar)
..* find and select the class you wish to analyze
..* choose the Bytecode node or Three-Address-Code node to open the desired representation
