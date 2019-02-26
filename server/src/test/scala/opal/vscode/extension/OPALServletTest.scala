import org.scalatra.test.scalatest._
import org.scalatest.FunSuiteLike
import opal.extension.vscode.servlet.OPALServlet;

class OPALServletTests extends ScalatraSuite with FunSuiteLike {
  
    addServlet(classOf[OPALServlet], "/*")

    test("project load ok") {
        post("/project/load", "{\"projectId\":\"abc\", \"classpath\":\"abc\" }") {
            body should equal ("100 % loaded")
            status should equal (200)
        }
    }

    test("project load fail") {
        
        post("/project/load", "") {
            body should equal ("Error: Body is empty!")
            status should equal (200)
        }

        post("/project/load", "{\"projectId\":\"abc\"}") {
            body should equal ("Error: classpath is empty!")
            status should equal (200)
        }

        post("/project/load", "{\"projectId\":\"\"}") {
            body should equal ("Error: Project ID is empty!")
            status should equal (200)
        }
    }

    test("project load log fail") {
        post("/project/load/log", "{\"projectId\":\"\"}") {
            body should equal ("Error: Project ID is empty!")
            status should equal (200)
        }

        post("/project/load/log", "{\"projectId\":\"xyz\"}") {
            body should equal ("Error: Project not found!")
            status should equal (200)
        }
    }

    test("project load log ok") {
        post("/project/load/log", "{\"projectId\":\"abc\"}") {
            body should equal ("100 % loaded")
            status should equal (200)
        }
    }
}