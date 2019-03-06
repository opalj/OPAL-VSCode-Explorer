package opal.extension.vscode

import opal.extension.vscode.model._;
import org.opalj.br.analyses.Project
import org.opalj.br.analyses.Project.JavaClassFileReader
import org.opalj.br.reader.Java9LibraryFramework
import org.opalj.log.{LogContext, LogMessage, OPALLogger}
import org.opalj.tac.{DefaultTACAIKey, ToTxt}

import java.io.File
import org.opalj.br.MethodDescriptor;

class OPALProject(projectId : String, opalInit : OpalInit) {

    protected val logger = new StringLogger();
    protected var  project : Project[java.net.URL] = null;
    
    def load() : String = {
        val  targetClassFiles = JavaClassFileReader().AllClassFiles(opalInit.targets.map(new File(_)))
        val libraryClassFiles = Java9LibraryFramework.AllClassFiles(opalInit.libraries.map(new File(_)))
        project = Project(
            targetClassFiles, 
            libraryClassFiles, 
            libraryClassFilesAreInterfacesOnly = true,
            virtualClassFiles = Traversable.empty)(projectLogger = logger);
        "Project loaded"
    }

    def getLog() : String = {
        logger.flushLogs();
    }

    def getTacForMethod(tacForMethod : TACForMethod) : String = {
        val tacAI = project.get(DefaultTACAIKey)
        project.allClassFiles.find(_.fqn  == tacForMethod.fqn).get.findMethod(tacForMethod.methodName,MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
        val tac = project.allClassFiles.find(_.fqn == tacForMethod.fqn).get.findMethod(tacForMethod.methodName,MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
        ToTxt(tac).mkString("\n")
    }

    def getTacForClass(tacForClass : TACForClass) : String = {
        val tacAI = project.get(DefaultTACAIKey)
        val tacArray = project.allClassFiles.find(_.fqn == tacForClass.fqn).get.methods.map(tacAI)        
        var tacString = new StringBuilder();
        val res = tacArray.addString(tacString);
        res.mkString("");
    }
}

class StringLogger extends OPALLogger {

    protected var logCache = "";

    override def log(message: LogMessage)(implicit ctx: LogContext): Unit = {
        logCache + message.message;
    }

    def flushLogs(): String = {
        var tmp = logCache;
        logCache = "";
        if (tmp == "") tmp = "Logs are empty"
        tmp;
    }
}