# opal-vscode-explorer README

## Description

This extension aims to bring the advantages of [Opal-Project](http://www.opal-project.de/) into VSCode.
Features include Java bytecode processing, engineering, manipulation and analysis functionality like three-address-code oder bytecode view.

## Usage

To use this Extension you will need JRE and a Java like Project.
Please make sure java executable is in your Path.

### Quick Start

1. To start using OPAL in VSCode just click the lense symbol in the sidebar.
2. Open your classes root directory (e.g. classes/ or test-classes/) by click "Open Targets"
3. The View should display the Classes of your Project.
4. Navigate to the class you would like to analyze and click the representation you like to open.

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

Please note, that the current workspace root is automatically added to the library directories. If the workspace root changes, the old entry in the library directorie's settings field gets automatically replaced by the new one. Other library folders which were added manually are persistent.
Please make sure you opened the ROOT of your targets.
