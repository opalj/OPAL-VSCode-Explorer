package opal.extension.vscode

import opal.extension.vscode.model._;
import org.opalj.br.analyses._
import org.opalj.br.analyses.Project.JavaClassFileReader
import org.opalj.br.reader.Java9LibraryFramework
import org.opalj.log.{LogContext, LogMessage, OPALLogger}
import org.opalj.tac.{DefaultTACAIKey, ToTxt}
import org.opalj.br.ObjectType

import java.io.File
import org.opalj.br.MethodDescriptor;
import org.json4s.jackson.Serialization.write
import org.json4s.{DefaultFormats, Formats}
import org.opalj.br.fpcf._ 
import org.opalj.br.fpcf.PropertyStoreKey
import org.opalj.collection.immutable.Chain
import org.opalj.fpcf.ComputationSpecification
import org.opalj.fpcf.FinalEP
import org.opalj.fpcf.FinalP
import org.opalj.fpcf.PropertyStore
import org.opalj.br.DeclaredMethod
import org.opalj.br.analyses.DeclaredMethods
import org.opalj.br.analyses.DeclaredMethodsKey
import org.opalj.br.instructions.MethodInvocationInstruction
import org.opalj.br.analyses.SomeProject
import org.opalj.br.fpcf.cg.properties.Callees
import org.opalj.br.fpcf.cg.properties.CallersProperty
import org.opalj.br.fpcf.cg.properties.ReflectionRelatedCallees
import org.opalj.br.fpcf.cg.properties.SerializationRelatedCallees
import org.opalj.br.fpcf.cg.properties.StandardInvokeCallees
import org.opalj.br.fpcf.cg.properties.ThreadRelatedIncompleteCallSites
import org.opalj.br.fpcf.FPCFAnalysesManager
import org.opalj.br.fpcf.FPCFAnalysesManagerKey
import org.opalj.br.fpcf.FPCFAnalysis
import org.opalj.br.fpcf.PropertyStoreKey
import org.opalj.tac.fpcf.analyses.cg.reflection.TriggeredReflectionRelatedCallsAnalysis
import org.opalj.tac.fpcf.analyses.cg._
import org.opalj.tac.fpcf.analyses._
import org.opalj.ai.fpcf.analyses._

/**
 * Link to OPAL
 * Every instance of this class represents a Project that is analyzed by OPAL 
 * @param projectId: The ID of the Project.
 * @param opalInit: OPAL initialization Message
 */
class OPALProject(projectId : String, opalInit : OpalInit) {

    protected val logger = new StringLogger();
    protected var  project : Project[java.net.URL] = null;
    implicit val formats = DefaultFormats
    
    /**
     * Let OPAL load / analyze the Project with the opalInit Message
     **/
    def load() : String = {
        val  targetClassFiles = JavaClassFileReader().AllClassFiles(opalInit.targets.map(new File(_)))
        val libraryClassFiles = Java9LibraryFramework.AllClassFiles(opalInit.libraries.map(new File(_)) :+ org.opalj.bytecode.RTJar ) // 
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
        var logs = logger.getLogs;
        logger.flushLogs();
        logs;
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
        var res = tacForClass.fqn +".class\n"
        var cf = project.allClassFiles.find(_.fqn == tacForClass.fqn);

        if (cf.isEmpty) {
            res = "Class File for fqn = "+tacForClass.fqn+" not found!\nPlease make sure your workspace root is set to the targets root of your build system e.g. classes/";
        } else {
            cf.get.methods.foreach({
                m =>
                var tac = tacAI(m);
                res += (if (m.isStatic) "static " else "") + m.descriptor.toJava(m.name);
                res += "\n{\n";
                res += ToTxt(m)
                res += "\n}\n"
            })
            //val tacArray = project.allClassFiles.find(_.fqn == tacForClass.fqn).get.methods.map(tacAI)
            //var res = "";
            //tacArray.foreach(res += ToTxt(_).mkString("\n"));
            res + "\n"
        }
        res
    }

    /**
     * Implementation of the get byte code command
     * Get byte code command can be triggered using the any command through the loadAny route at the OPALServlet.
     * The params Map must contain:
     * -> The fully qualified name of the class that contains the method
     * -> The name of the Method for which you want the byte code
     * -> The descriptor of the method to id the correct method (two methods can have the same name)
     **/
    def getBCForMethod(opalCommand : OpalCommand) : String = {
        var res = "";
        if (!opalCommand.params.contains("fqn")) {
            res = "Missing fqn (fully qualified name)"
        } else if (!opalCommand.params.contains("methodName")) {
            res = "Missing method name"
        } else if (!opalCommand.params.contains("descriptor")) {
            res = "Missing Method descriptor"
        } else {
            var fqn = opalCommand.params.get("fqn").get;
            var methodName = opalCommand.params.get("methodName").get;
            var descriptor = opalCommand.params.get("descriptor").get;
            var cf = project.allClassFiles.find(_.fqn  == fqn);
            if (cf.isEmpty) {
                res = "Class File for fqn = "+fqn+" not found!\nPlease make sure your workspace root is set to the targets root of your build system e.g. classes/";
            } else {
                //var method = cf.get.findMethod(methodName,MethodDescriptor(descriptor));
                cf.get.methods.foreach({
                    method => 
                        if (method.name == methodName) { //@TODO: check method descriptor to id method
                            //res = write(method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep);
                            res = method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep.toString
                        }
                })
            }
        }
        res
    }

    def getCallGraph(opalCommand : OpalCommand) : String = {
        var res = "";
        if (!opalCommand.params.contains("fqn")) {
            res = "Missing fqn (fully qualified name)"
        } else if (!opalCommand.params.contains("methodName")) {
            res = "Missing method name"
        } else if (!opalCommand.params.contains("descriptor")) {
            res = "Missing Method descriptor"
        } else {
            val ps = project.get(PropertyStoreKey)
            val manager = project.get(FPCFAnalysesManagerKey)
            implicit val declaredMethods = project.get(DeclaredMethodsKey)
            manager.runAll(
                            RTACallGraphAnalysisScheduler,
                            TriggeredStaticInitializerAnalysis,
                            TriggeredLoadedClassesAnalysis,
                            TriggeredFinalizerAnalysisScheduler,
                            TriggeredThreadRelatedCallsAnalysis,
                            TriggeredSerializationRelatedCallsAnalysis,
                            TriggeredReflectionRelatedCallsAnalysis,
                            TriggeredInstantiatedTypesAnalysis,
                            TriggeredConfiguredNativeMethodsAnalysis,
                            TriggeredSystemPropertiesAnalysis,
                            LazyCalleesAnalysis(
                                Set(
                                    StandardInvokeCallees,
                                    SerializationRelatedCallees,
                                    ReflectionRelatedCallees,
                                    ThreadRelatedIncompleteCallSites
                                )
                            ),
                            LazyL0BaseAIAnalysis,
                            TACAITransformer
            )
            var fqn = opalCommand.params.get("fqn").get;
            var methodName = opalCommand.params.get("methodName").get;
            var descriptor = opalCommand.params.get("descriptor").get;
            var cf = project.allClassFiles.find(_.fqn  == fqn);
            if (cf.isEmpty) {
                res = "Class File for fqn = "+fqn+" not found!\nPlease make sure your workspace root is set to the targets root of your build system e.g. classes/";
            } else {
                //var method = cf.get.findMethod(methodName,MethodDescriptor(descriptor));
                
                cf.get.methods.foreach({
                    method => 
                        if (method.name == methodName) {
                            //res = write(method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep);
                            val dm = declaredMethods(method)
                            ps(dm, CallersProperty.key /*Callees.key*/) // create svg from callees
                        }
                })
                
            }
        }
        res
    }

     /**
     * Get the Any
     **/
    def getAny(opalCommand : OpalCommand) : String = {
        var tacString = new StringBuilder();
        var command = opalCommand.command;
        var res = "";
        command match{
            case "getSVG" => res= "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">"+
            "<path d=\"M30,1h40l29,29v40l-29,29h-40l-29-29v-40z\" stroke=\"#000\" fill=\"none\"/>" +
            "<path d=\"M31,3h38l28,28v38l-28,28h-38l-28-28v-38z\" fill=\"#a23\"/>"+
            "<text x=\"50\" y=\"68\" font-size=\"48\" fill=\"#FFF\" text-anchor=\"middle\"><![CDATA[410]]></text>"+
          "</svg>";
          case "getBC" => res = getBCForMethod(opalCommand);
        }
        
        res.mkString("");
    }
}

/*
 * This is a small implementation of the OPAL Logger.
 * This is necessary for providing the logs to the client (in a diffrent process)
 */
class StringLogger extends OPALLogger {

    protected var logCache = "";

    override def log(message: LogMessage)(implicit ctx: LogContext): Unit = {
        logCache = logCache + message.message + "\n";
    }

    def flushLogs()  : Unit = {
        logCache = "";
    }

    def getLogs() : String = {
        logCache;
    }
}