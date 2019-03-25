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
        var res = "";
        tacArray.foreach(res += ToTxt(_).mkString("\n"));
        res;
    }

     /**
     * Get the Any
     **/
    def getAny(opalCommand : OpalCommand) : String = {
        var tacString = new StringBuilder();
        val res = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">"+
            "<path d=\"M30,1h40l29,29v40l-29,29h-40l-29-29v-40z\" stroke=\"#000\" fill=\"none\"/>" +
            "<path d=\"M31,3h38l28,28v38l-28,28h-38l-28-28v-38z\" fill=\"#a23\"/>"+
            "<text x=\"50\" y=\"68\" font-size=\"48\" fill=\"#FFF\" text-anchor=\"middle\"><![CDATA[410]]></text>"+
          "</svg>";
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