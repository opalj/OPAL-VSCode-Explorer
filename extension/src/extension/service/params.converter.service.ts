import * as vscode from "vscode";

export class ParamsConverterService {

    public static targetsRoot = "";

    /**
     * Get fqn path for file from its path
     * @param targetFilePath Path to target file
     * @param targetsDir Directory for the targets
     */
    static getFQN(targetFilePath : string) : string {
        let targetFileParts = this.getPathParts(vscode.workspace.asRelativePath(targetFilePath));
        let targetRootParts = this.getPathParts(vscode.workspace.asRelativePath(ParamsConverterService.targetsRoot));

        let path = "";
        if (targetRootParts.length > 0) {
            let targetRootIndex = 0;
            let targetFileIndex = 0;

            /**
             * find first item from target that is also in file path
             */
            for (targetRootIndex = 0; targetRootIndex < targetRootParts.length; targetRootIndex++) {
                let startIndex = targetFileParts.indexOf(targetRootParts[targetRootIndex]);
                if (startIndex > 0) {
                    targetFileIndex = startIndex;
                    break;
                }
            }
            
            /**
             * count equal items in target file path and target root path
             */
            while(targetFileParts[targetFileIndex] === targetRootParts[targetRootIndex]) {
                targetFileIndex++;
                targetRootIndex++;
            }
            targetFileParts = targetFileParts.slice(targetFileIndex);
        }

        if (targetFileParts[0] === "classes") {
            targetFileParts = targetFileParts.slice(1);
        }

        if (targetFileParts[targetFileParts.length-1] === "class") {
            targetFileParts.splice(-1);
        }

        path = targetFileParts.join("/");
        return path;
    }

    static getPathParts(path : string) {
        const regex = /[a-zA-Z0-9]+/gm;
        let match;
        let result = [];
        while ((match = regex.exec(path)) !== null) {
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result.push(match[0]);
        }
        return result;
    }
}