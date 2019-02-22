package opal.extension.vscode.servlet

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

    protected val workspace = new HashMap[String, Project];
    
    before() {
        contentType = formats("json")
    }

    post("/project/load") {
        var json = request.body;
        var params = parse(json).values.asInstanceOf[Map[String, String]];

        var res = "";
        var projectId = params.get("projectId");
        if (projectId.isEmpty) {
            res = "Error: Project ID is empty!"
            res;
        }
        var classPath = params.get("classpath");
        if (classPath.isEmpty) {
            res = "Error: classpath is empty!";
            res;
        }
        var project : Project = null;
        if (workspace.get(projectId.get).isEmpty) {
            project = new Project(projectId.get, classPath.get);
            workspace.put(projectId.get, project);
        } else {
            project = workspace.get(projectId.get).get;
        }
        project.load();
    }

    post("/project/load/log") {
        var json = request.body;
        var params = parse(json).values.asInstanceOf[Map[String, String]];

        var res = "";
        var projectId = params.get("projectId");
        if (projectId.isEmpty) {
            res = "Error: Project ID is empty!"
            res;
        }

        var project : Project = null;
        if (workspace.get(projectId.get).isEmpty) {
            res = "Error: Project not found!"
            res;
        } else {
            project = workspace.get(projectId.get).get;
        }
        project.getLog();
    }
}