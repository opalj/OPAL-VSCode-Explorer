import org.scalatra.test.scalatest._
import org.scalatest.FunSuiteLike
import opal.extension.vscode._

class HelloWorldServletTests extends ScalatraSuite with FunSuiteLike {
  // `HelloWorldServlet` is your app which extends ScalatraServlet
  addServlet(classOf[TACServlet], "/*")

  test("get tac route") {
    get("/tac/abc") {
      status should equal (200)
      body should include ("abc")
      body should include ("param0: useSites={0} (origin=-1)")
      body should include ("1:/*pc=4:*/ return}")
    }
  }
}