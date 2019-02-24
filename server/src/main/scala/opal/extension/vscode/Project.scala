package opal.extension.vscode

class Project(projectId : String, classPath : String) {

    protected var status = "";
    protected var log = "";

    def load() : String = {
        if (status != "loaded") {
            /**
            * OPAL
            */
            log = "25 % loaded";
            Thread.sleep(5000);
            log = "50 % loaded";
            Thread.sleep(5000);
            log = "75 % loaded";
            Thread.sleep(5000);
            log = "100 % loaded";
            status = "loaded";
        }
        log;
    }

    def delete() : String = {
        log = "";
        status = "deleted";
        "deleted";
    }

    def getLog() : String = {
        /**
         * OPAL Logger
         */
         var res = log;
         res;
    }

    def getTac() : String = {
        /**
         * OPAL
         */
         var res = "";
         res;
    }
}