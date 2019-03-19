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
     * OPAL loading the Project
     * OpalInit Message
     */
    post("/project/load") {
        var opalInit = parsedBody.extract[OpalInit]
        var project : OPALProject = null;
        if (workspace.get(opalInit.projectId).isEmpty) {
            project = new OPALProject(opalInit.projectId, opalInit);
            workspace.put(opalInit.projectId, project);
        } else {
            project = workspace.get(opalInit.projectId).get;
        }
        project.load()
    }

    /**
     * Load anything from OPAL
     * This route can be used for anny command specified in OpalCommand Message (see model.scala)
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
     * TAC for one Method
     * TACForMethod Message
     */
    post("/project/tac/method") {
        var tacForMethod = parsedBody.extract[TACForMethod]
        var project : OPALProject = null;
        var res = "";
        if (workspace.get(tacForMethod.projectId).isEmpty) {
            res = "Error: Project not found!";
        } else {
            project = workspace.get(tacForMethod.projectId).get;
            res = project.getTacForMethod(tacForMethod);
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
    post("/project/delete") {
        var json = request.body;
        var params = parse(json).values.asInstanceOf[Map[String, String]];

        var res = "";
        var projectId = params.get("projectId");
        if (projectId.isEmpty) {
            res = "Error: Project ID is empty!";
        } else {
            workspace -= projectId.get;
        }
        res;
    }
}

