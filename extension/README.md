# opal-vscode-explorer README
## Description
This extension aims to bring the advantages of [Opal-Project](http://www.opal-project.de/) into VSCode.
Features include Java bytecode processing, engineering, manipulation and analysis functionality like three-address-code oder bytecode view.

## Usage
Open the classes Folder in your projects target directory. 
The server should start and load the project.
After the project ist loaded you have two options:

1. At the VSCode file explorer context menu right click a class file in your file explorer and choose "Three-Address-Code ..." to open its three-address-code

2. At the Opal Explorer Tree-View (lens symbol inside the activitybar) find and select the class you wish to analyze by choosing the Three-Address-Code node you can open the desired representation

## Configuration

1.0 There are several settings, you can change to your desires:

### Find the settings

1.1. (Windows and Linux) Open File > Preferences > Settings > Extensions > OPAL VSCode Explorer

(Mac) Open Code > Preferences > Settings > Extensions > OPAL VSCode Explorer

### Examples, how to change settings

1.2. Add `"OPAL.opal.targetDir": "Path to your project / target folder"`

1.3. Add `"OPAL.opal.librariesDirs": "Paths to your libraries folders sperated by ';'"`

1.4. Add `"OPAL.server.jar": "Path to your Opal Command Server jar"`

For Windows users this jar can be found at 
```
"%userprofile%\\.vscode\\extensions\\stg.java-bytecode-workbench-X.X.X\\OPAL Command Server-assembly-X.X.X-SNAPSHOT.jar"
```

For Linux and Mac users this jar can be found at
```
"$HOME/.vscode/extensions/stg.java-bytecode-workbench-X.X.X/OPAL Command Server-assembly-X.X.X-SNAPSHOT.jar"
```

Do not forget to seperate the settings with commas. A valid setting.json (on Windows) could look like this:

```
{
    "editor.suggestSelection": "first",
    "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
    "java.configuration.checkProjectSettingsExclusions": false,
    "OPAL.opal.targetDirs": "C:\\Users\\AUser\\Documents\\myProject",
    "OPAL.opal.librariesDirs": "C:\\Users\\AUser\\Documents\\myLibs;C:\\Users\\AUser\\otherLibs\\",
    "OPAL.server.jar": "C:\\Users\\AUser\\.vscode\\extensions\\stg.java-bytecode-workbench-0.1.3\\OPAL Command Server-assembly-0.1.0-SNAPSHOT.jar"
}
```