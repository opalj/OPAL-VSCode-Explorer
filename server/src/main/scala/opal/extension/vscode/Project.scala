package opal.extension.vscode

class Project(projectId : String, classPath : String) {

    protected var status = "";
    protected var log = "";

    def load() : String = {
        /**
         * OPAL
         */
         status = "loaded";
         log = "25 % loaded";
         Thread.sleep(5000);
         log = "50 % loaded";
         Thread.sleep(5000);
         log = "75 % loaded";
         Thread.sleep(5000);
         log = "100 % loaded";
         Thread.sleep(5000);
         var res = "";
         log
    }

    def getTac() : String = {
        /**
         * OPAL
         */
         var res = "";
         res;
    }

    def getLog() : String = {
        /**
         * OPAL Logger
         */
         var res = log;
         res;
    }
}