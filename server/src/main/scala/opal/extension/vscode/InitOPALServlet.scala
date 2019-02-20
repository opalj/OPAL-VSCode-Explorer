package opal.extension.vscode

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._
import scala.io.Source
import java.io.File



class InitOPALServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;
    
    before() {
        contentType = formats("json")
    }

    post("/init") {
        var opalStatus = parsedBody.extract[OPALStatus];
        opalStatus.status = "init started";
        opalStatus
    }
}


case class OPALStatus (classpath: String, var status: String)

