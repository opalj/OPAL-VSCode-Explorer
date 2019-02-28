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
        if (workspace.get(opalInit.projectID).isEmpty) {
            project = new OPALProject(opalInit.projectID, opalInit);
            workspace.put(opalInit.projectID, project);
        } else {
            project = workspace.get(opalInit.projectID).get;
        }
        project.load()
    }

    post("/project/load/log") {
        var json = request.body;
        var params = parse(json).values.asInstanceOf[Map[String, String]];

        var res = "";
        var projectId = params.get("projectId");
        if (projectId.isEmpty || projectId.get == "") {
            res = "Error: Project ID is empty!";
        } else {
            var project : OPALProject = null;
            if (workspace.get(projectId.get).isEmpty) {
                res = "Error: Project not found!";
            } else {
                project = workspace.get(projectId.get).get;
                res = project.getLog();
            }
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
            var project : OPALProject = null;
            if (workspace.get(projectId.get).isEmpty) {
                res = "Error: Project not found!"
                res;
            } else {
                project = workspace.get(projectId.get).get;
            }
            res = project.delete();
        }
        res;
    }
}

