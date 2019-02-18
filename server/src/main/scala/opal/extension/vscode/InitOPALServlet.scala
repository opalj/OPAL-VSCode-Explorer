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

    get("/:classpath") {
        new OPAL(params("classpath"), "pending"); 
    }
}


case class OPAL (classpath: String, status: String)

