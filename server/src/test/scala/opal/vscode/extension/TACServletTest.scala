import org.scalatra.test.scalatest._
import org.scalatest.FunSuiteLike
import opal.extension.vscode.servlet.TACServlet;

class TACServletTests extends ScalatraSuite with FunSuiteLike {
  
  addServlet(classOf[TACServlet], "/*")

  test("get tac route") {
    get("/short1.txt") {
      status should equal (200)
      body should include ("void <init>(){")
    }
  }
}