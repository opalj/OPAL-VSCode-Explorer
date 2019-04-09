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

/**
 * Servlet for /opal/ routes
 * This is an HTTP Interface for OPAL
 * To add a command you have to:
 * 1. add a route in this class for your command (/opal/<command>)
 * 2. add a Message to model.scala for alle information you need for your command
 * 3. add a Method to OPALProject.scala where you implement your command
 * 4. implement corresponding methods at the extension in project.service.ts 
 */
class OPALServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;

    protected val workspace = new HashMap[String, OPALProject];
    
    before() {
        contentType = formats("json")
    }

    /**
     * Get Context Information for a class File
     **/
    post("/context/fqn") {
        var res = ""
        var filename = request.body
        org.opalj.br.analyses.Project.JavaClassFileReader().ClassFiles(new java.io.File(filename)).foreach({
            cf => 
                if (!cf._1.isVirtualType) {
                    res = cf._1.fqn
                }
        })
        res
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
            project = new OPALProject(opalInit.projectId, opalInit);
            workspace.put(opalInit.projectId, project);
            res = project.load()
        } else {
            project = workspace.get(opalInit.projectId).get;
            res = "Project already loaded!"
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
        if (workspace.get(logMessage.projectId).isEmpty) {
            res = "Error: Project not found!";
        } else {
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

