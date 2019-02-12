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

    get("/tac/:id") {
        new TAC(params("id"), "void <init>(){"+
      "/* PARAMETERS:"+
         "param0: useSites={0} (origin=-1)"+
      "*/"+
    "0:/*pc=1:*/ {param0}/*(non-virtual) java.lang.Object*/.<init>()"+
      "// ⚡️ <uncaught exception ⇒ abnormal return>"+
      "// 0 →"+
    "1:/*pc=4:*/ return}"
    )
    }
}


case class TAC (id: String, tac: String)

