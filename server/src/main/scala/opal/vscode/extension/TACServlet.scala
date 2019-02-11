package opal.vscode.extension

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._
import scala.io.Source



class TACServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;
    
    before() {
        contentType = formats("json")
    }

}

