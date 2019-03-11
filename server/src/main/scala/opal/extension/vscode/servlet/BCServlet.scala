package opal.extension.vscode.servlet

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._
import scala.io.Source
import java.io.File



class BCServlet extends ScalatraServlet  with JacksonJsonSupport   {
//BC im Namen steht für Bytecode. Die Dateiendung für Bytecode ist .class.
    protected implicit lazy val jsonFormats: Formats = DefaultFormats;
    
    before() {
        contentType = formats("json")
    }

    get("/:id") {
		var bcDir = new File(".").getCanonicalPath()+File.separator+"src"+File.separator+"main"+File.separator+"webapp"+File.separator+"class-examples"
		var content = ""
		var target = bcDir + File.separator + params("id")

		try{
			content = Source.fromFile(target, "UTF-8").getLines.mkString("\n");
		}catch{
			case e: Exception => content = params("id") + " " + e.getMessage()
		}

		
        new Bytecode(params("id"), content)
    }
}


case class Bytecode (id: String, bytecode: String)
