# opal-vscode-explorer README

## Installation
-------------------------------

# Server
-------------------------------
1. Auf der Kommandozeile in Ordner extension wechseln: 
cd server

2. sbt starten
sbt

3. JAR Datei bauen
assembly

# Konfiguration der extension
-------------------------------
In opal.config.json:

targetsDir: 
- Auf den Pfad zum target Ordner im Projekt setzen. Dort sind die zu analysierenden class Dateien.
- Diese Dateien werden von OPAL eingelesen

librariesDir:
- Auf den lib Order im Projekt setzen. Dort sollten die .jar Dateien sein von denen das Projekt abhängt.

serverJarPath:
- Jar Datei zum server. (Wurde vorher mit assembly erstellt)

# Extension starten
-------------------------------
1. Auf der Kommandozeile in Ordner extension wechseln: 
cd extension

2. Abhängigkeiten installieren:
npm install

3. VS Code starten: 
code .

4. extension.ts öffnen und F5 drücken. Es öffnet sich ein VS Code Fenster in dem die Extenson installiert ist.

Mehr Infos: https://code.visualstudio.com/api/get-started/your-first-extension

## Tests

https://code.visualstudio.com/api/working-with-extensions/testing-extension