package opal.extension.vscode

import opal.extension.vscode.model._;
import org.opalj.br.analyses.Project
import org.opalj.br.analyses.Project.JavaClassFileReader
import org.opalj.br.reader.Java9LibraryFramework
import org.opalj.log.{LogContext, LogMessage, OPALLogger}
import org.opalj.tac.{DefaultTACAIKey, ToTxt}

import java.io.File
import org.opalj.br.MethodDescriptor;

/**
 * Link to OPAL
 * Every instance of this class represents a Project that is analyzed by OPAL 
 * @param projectId: The ID of the Project.
 * @param opalInit: OPAL initialization Message
 */
class OPALProject(projectId : String, opalInit : OpalInit) {

    protected val logger = new StringLogger();
    protected var  project : Project[java.net.URL] = null;
    
    /**
     * Let OPAL load / analyze the Project with the opalInit Message
     **/
    def load() : String = {
        val  targetClassFiles = JavaClassFileReader().AllClassFiles(opalInit.targets.map(new File(_)))
        val libraryClassFiles = Java9LibraryFramework.AllClassFiles(opalInit.libraries.map(new File(_)) :+ org.opalj.bytecode.RTJar )
        project = Project(
            targetClassFiles, 
            libraryClassFiles, 
            libraryClassFilesAreInterfacesOnly = true,
            virtualClassFiles = Traversable.empty)(projectLogger = logger);
        "Project loaded"
    }

    /**
     * Get the Logs from OPAl
     */
    def getLog() : String = {
        logger.getLogs;
    }

    /**
     * Get the TAC of a Method
     **/
    def getTacForMethod(tacForMethod : TACForMethod) : String = {
        val tacAI = project.get(DefaultTACAIKey)
        project.allClassFiles.find(_.fqn  == tacForMethod.fqn).get.findMethod(tacForMethod.methodName,MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
        val tac = project.allClassFiles.find(_.fqn == tacForMethod.fqn).get.findMethod(tacForMethod.methodName,MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
        ToTxt(tac).mkString("\n")
    }

    /**
     * Get the TAC of a Class
     **/
    def getTacForClass(tacForClass : TACForClass) : String = {
        val tacAI = project.get(DefaultTACAIKey)
        val tacArray = project.allClassFiles.find(_.fqn == tacForClass.fqn).get.methods.map(tacAI)        
        var tacString = new StringBuilder();
        val res = tacArray.addString(tacString);
        res.mkString("");
    }
 
    def getBC(opalCommand : OpalCommand) : String = {
        var result = "";
        if (opalCommand.params.contains("fqn")) {
            result = "Missing fqn (fully qualified name)"
        } else if (opalCommand.params.contains("methodName")) {
            result = "Missing method name"
        } else if (opalCommand.params.contains("descriptor")) {
            result = "Missing Method descriptor"
        } else {
            var fqn = opalCommand.params.get("fqn").get;
            var methodName = opalCommand.params.get("methodName").get;
            var descriptor = opalCommand.params.get("descriptor").get;
            var method = project.allClassFiles.find(_.fqn  == fqn).get.findMethod(methodName,MethodDescriptor(descriptor)).get;
            result = method.toString();
        }
        result
    }

     /**
     * Get the Any
     **/
    def getAny(opalCommand : OpalCommand) : String = {
        var tacString = new StringBuilder();
        val res = "test";
        res.mkString("");
    }
}

/**
 * This is a small implementation of the OPAL Logger.
 * This is necessary for providing the logs to the client (in a diffrent process)
 */
class StringLogger extends OPALLogger {

    protected var logCache = "";

    override def log(message: LogMessage)(implicit ctx: LogContext): Unit = {
        logCache = message.message;
    }

    def flushLogs()  : Unit = {
        logCache = "";
    }

    def getLogs() : String = {
        logCache;
    }
}