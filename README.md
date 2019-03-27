# opal-vscode-explorer README
##Description
This extension aims to bring the advantages of [Opal-Project](http://www.opal-project.de/) into VSCode.
Features include Java bytecode processing, engineering, manipulation and analysis functionality like three-Address-Code oder bytecode View.

##Before you start
1. Please configure the necessary settings as follows:
..* Open File > Preferences > Settings > OPAL VSCode Explorer: Set the following paths as in our example
....* Add "OPAL.opal.targetDir": "C:\\Users\\Documents\\Projectfolder" 
....* Add "OPAL.opal.librariesDir": "C:\\Users\\Documents\\Libraries"

##Usage
1. VSCode file explorer context menu
..* Right click a class file in your file explorer and choose
....* "Three-Address-Code ..." to open its three-address-code
....* "Bytecode ..." to open its bytecode
2. Opal Explorer - Tree-View (lens symbol inside the activitybar)
..* Find and select the class you wish to analyze
..* By choosing the Bytecode node or Three-Address-Code node you can open the desired representation
