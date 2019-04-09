import org.scalatest.FunSuiteLike
import opal.extension.vscode._
import org.scalatra.test.scalatest._
import opal.extension.vscode.model._;

class OPALProjectTests extends ScalatraSuite with FunSuiteLike {
    test("get context infos from class file") {
        var filename = "C:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\scala-2.12\\classes\\opal\\extension\\vscode\\OPALProject.class";
        val  opalProject = new OPALProject("", OpalInit("", Array(""), Array(""), Map("" -> "")));
        var context = opalProject.getClassFileContext(OpalCommand("", "", Map("filename" -> filename)));
        context should include("opal/extension/vscode/OPALProject")
    }
}