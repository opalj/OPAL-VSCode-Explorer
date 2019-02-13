package opal.vscode.extension

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._
import scala.io.Source
import java.io.File



class TACServlet extends ScalatraServlet  with JacksonJsonSupport   {

    protected implicit lazy val jsonFormats: Formats = DefaultFormats;
    
    before() {
        contentType = formats("json")
    }

    get("/tac/:id") {
		var tacDir = "./src/main/webapp/tac-examples"
		var content = "Could not load file properly"
		
		var target = tacDir + "/" + params("id")

		content = Source.fromFile(target).getLines.mkString

        new TAC(params("id"), content)
    }
}


case class TAC (id: String, tac: String)

