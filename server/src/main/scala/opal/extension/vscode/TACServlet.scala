package opal.extension.vscode

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
		var content = ""
		
		var target = tacDir + "/" + params("id")

		try{
			content = Source.fromFile(target).getLines.mkString

		}catch{
			case e: Exception => content = "Could not finde tac-file of given name: " + params("id") + "!"
		}
        new TAC(params("id"), content)
    }
}


case class TAC (id: String, tac: String)

