package opal.extension.vscode.servlet

import opal.extension.vscode.model._
import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.json4s.jackson.JsonMethods._
import org.scalatra.json._
import scala.io.Source
import java.io.File
import opal.extension.vscode._
import scala.collection.mutable.HashMap;
import org.json4s.jackson.Serialization.write
import java.io.File
import org.opalj.br.analyses.Project.JavaClassFileReader
import org.json4s.jackson.Serialization.read
import scala.collection.mutable.Map

/**
 * Servlet for /opal/ routes
 * This is an HTTP Interface for OPAL
 * To add a command you have to add a branch to switch case in anyCommand Method in OPALProject.scala
 */
class OPALServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;

    protected val workspace = new HashMap[String, OPALProject];
    
    before() {
        contentType = formats("json")
    }

    /**
     * Get Context Information for all class Files
     * @param Array of Paths to the class Files 
     **/
    post("/context/class") {
        // path should be a string array
        val paths : Array[String] = parse(request.body).extract[Array[String]]
        val classInfos = paths.par.map(path => {
            // get single non virtual class from .class file
            val cf = org.opalj.br.analyses.Project.JavaClassFileReader().ClassFiles(new java.io.File(path)).filter(cf => !cf._1.isVirtualType)
            
            if (cf.length > 0) {
                val methods = cf(0)._1.methods.filter(m => !m.isFinal);
                var methodsInfos = Array[MethodContext]();
                methods.foreach(m => {
                    val descriptorMatcher = """MethodDescriptor\((.*),(.*)\)""".r
                    val toJava = m.descriptor.toJava match {
                        case descriptorMatcher(returnType, params) => s"$returnType ${m.name}$params"
                    }
                    methodsInfos = methodsInfos :+ new MethodContext(m.name, m.descriptor.toJava, m.accessFlags , toJava);
                })

                var attributes = Array[String]();
                cf(0)._1.attributes.foreach(attribute =>{
                    attributes = attributes :+ attribute.toString()
                    attribute.formatted("")
                })

                var fields = Array[String]();
                if (cf(0)._1.fields.length > 0) {
                    cf(0)._1.fields.foreach({
                        field => 
                        val fieldName = field.name
                        val fieldType = field.fieldType
                        fields = fields :+ field.name + " " + field.fieldType
                    });
                }

                val context = new ClassContext(path, cf(0)._1.fqn, methodsInfos, attributes, fields);
                write(context)
            }
        })    
        "["+classInfos.mkString(",")+"]"
    }    

    /**
     * OPAL loading the Project
     * OpalInit Message
     */
    post("/project/load") {
        var opalInit = parsedBody.extract[OpalInit]
        var project : OPALProject = null;
        var res = "";
        if (workspace.get(opalInit.projectId).isEmpty) {
            project = new OPALProject(opalInit);
            workspace.put(opalInit.projectId, project);
            res = project.load()
        } else {
            project = workspace.get(opalInit.projectId).get;
        }
        res;
    }

    /**
     * Load anything from OPAL
     * This route can be used for any command specified in OpalCommand Message (see model.scala)
     */
    post("/project/loadAny") {
        var opalCom = parsedBody.extract[OpalCommand]
        var project : OPALProject = null;
        var res = "";
        if (workspace.get(opalCom.projectId).isEmpty) {
            res = "Error: Project not found!";
        } else {
            project = workspace.get(opalCom.projectId).get;
            res = project.getAny(opalCom);
        }
        res;
    }

    /**
     * TACForClass Message
     */
    post("/project/tac/class") {
        var tacForClass = parsedBody.extract[TACForClass]
        var project : OPALProject = null;
        var res = "";
        if (workspace.get(tacForClass.projectId).isEmpty) {
            res = "Error: Project not found! ID = "+tacForClass.projectId;
        } else {
            project = workspace.get(tacForClass.projectId).get;
            res = project.getTacForClass(tacForClass);
        }
        res;
    }

    /**
     * Get Logs
     */
    post("/project/load/log") {
        var logMessage = parsedBody.extract[Log]
        var res = "";
        if (!workspace.get(logMessage.projectId).isEmpty) {
            res = workspace.get(logMessage.projectId).get.getLog();   
        }
        res;
    }

    /**
     * Delete OPAL Project
     */
    get("/project/delete/:projectId") {
        var projectId = params("projectId");
        var res = "";
        if (projectId.isEmpty) {
            res = "Error: Project ID is empty!";
        } else {
            workspace -= projectId;
        }
        res;
    }
}

