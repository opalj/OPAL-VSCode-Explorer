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


class OPALServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;

    protected val workspace = new HashMap[String, OPALProject];
    
    before() {
        contentType = formats("json")
    }

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

    post("/project/load/log") {
        var logMessage = parsedBody.extract[Log]
        var res = "";
        if (workspace.get(logMessage.projectID).isEmpty) {
            res = "Error: Project not found!";
        } else {
            res = workspace.get(logMessage.projectID).get.getLog();
        }
        res;
    }

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

