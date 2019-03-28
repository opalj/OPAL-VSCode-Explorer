# opal-vscode-explorer README
##Description
This extension aims to bring the advantages of [Opal-Project](http://www.opal-project.de/) into VSCode.
Features include Java bytecode processing, engineering, manipulation and analysis functionality like three-address-code oder bytecode view.

##Before you start
1. Please configure the necessary settings as follows:

1.1. (Windows and Linux) Open File > Preferences > Settings > Extensions > OPAL VSCode Explorer: Set the following paths as in our example
(Mac) Open Code > Preferences > Settings > Extensions > OPAL VSCode Explorer: Set the following paths as in our example

1.2. Add "OPAL.opal.targetDir": "Path to your project / target folder" 

1.3. Add "OPAL.opal.librariesDir": "Path to your libraries folder"

1.4. Add "OPAL.server.jar": "Path to your Opal Command Server jar"

For Windows users this jar can be found at "%userprofile%\\.vscode\\extensions\\stg.java-bytecode-workbench-X.X.X\\OPAL Command 
Server-assembly-X.X.X-SNAPSHOT.jar"

For Linux and Mac users this jar can be found at
"$HOME/.vscode/extensions/stg.java-bytecode-workbench-X.X.X/OPAL Command Server-assembly-X.X.X-SNAPSHOT.jar"

##Usage
1. VSCode file explorer context menu

1.1 Right click a class file in your file explorer and choose

1.2 "Three-Address-Code ..." to open its three-address-code


2 . Opal Explorer - Tree-View (lens symbol inside the activitybar)


2.1. Find and select the class you wish to analyze

2.1.1. By choosing the Three-Address-Code node you can open the desired representation

