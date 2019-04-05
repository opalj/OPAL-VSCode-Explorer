export class ParamsConverterService {

    public static targetsRoot = "";

    /**
     * Get fqn path for file from its path
     * @param targetFilePath Path to target file
     * @param targetsDir Directory for the targets
     */
    static getFQN(targetFilePath : string, targetsDir : string) : string {
        let targetFileParts = this.getPathParts(targetFilePath);
        let targetsDirParts = this.getPathParts(ParamsConverterService.targetsRoot);

        let path = "";
        if (ParamsConverterService.targetsRoot[0] === "/") {
            // number of directories to the target dir is equal to targetsDirParts.length
            targetFileParts = targetFileParts.slice(targetsDirParts.length);
        } else {
            // c: is counted as directory
            targetFileParts = targetFileParts.slice(targetsDirParts.length);
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