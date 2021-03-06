package opal.extension.vscode.servlet

import org.json4s.{DefaultFormats, Formats}
import org.scalatra._
import org.scalatra.json._

import java.io.File
import scala.io.Source


class TACServlet extends ScalatraServlet with JacksonJsonSupport {

  protected implicit lazy val jsonFormats: Formats = DefaultFormats;

  before() {
    contentType = formats("json")
  }

  get("/:id") {
    var tacDir = new File(".").getCanonicalPath() + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "tac-examples"
    var content = ""
    var target = tacDir + File.separator + params("id")

    try {
      content = Source.fromFile(target, "UTF-8").getLines.mkString("\n");
    } catch {
      case e: Exception => content = params("id") + " " + e.getMessage()
    }
    content
  }
}


case class TAC(id: String, tac: String)

