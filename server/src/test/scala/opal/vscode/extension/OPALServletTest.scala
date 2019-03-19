import org.scalatra.test.scalatest._
import org.scalatest.FunSuiteLike
import opal.extension.vscode.servlet.OPALServlet;

import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.write
import opal.extension.vscode.model._
import java.io.File


class OPALServletTests extends ScalatraSuite with FunSuiteLike {

    implicit val formats = DefaultFormats

    addServlet(classOf[OPALServlet], "/*")

    var classesPath = new File(".").getCanonicalPath()+File.separator+"target"+File.separator+"scala-2.12"+File.separator+"classes";
    var testProject = new File(".").getCanonicalPath()+File.separator+".."+File.separator+"dummy";

    test("Load Project and get TAC for Class") {
        var json = "";
        //var opalInit = OpalInit("abc", Array(classesPath+File.separator+"JettyLauncher.class"), Array(""), Map("key" -> "value"));
        var opalInit = OpalInit("abc", Array(testProject+File.separator+"Test.class"), Array(""), Map("key" -> "value"));
        json = write(opalInit);

        post("/project/load", json) {
            body should equal ("Project loaded")
            status should equal (200)
        }

        var tacForClass = TACForClass("abc", "Test", "Test");
        json = write(tacForClass);
        post("/project/tac/class", json) {
            body should ( include("java.io.PrintStream") and include("java.lang.System.out") and include("test1123"))
            status should equal (200)
        }

        var requestLogs = Log("abc", "", Map("key" -> "value"));
        json = write(requestLogs);
        post("/project/load/log", json) {
            body should include ("initialization of DefaultTACAI took")
            status should equal (200)
        }
    }
}