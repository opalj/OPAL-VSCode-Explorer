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

    test("project load ok") {
        var json = "";
        var opalInit = OpalInit("abc", Array(classesPath+File.separator+"JettyLauncher.class"), Array(""), Map("key" -> "value"));
        json = write(opalInit);
        post("/project/load", json) {
            body should equal ("100 % loaded")
            status should equal (200)
        }
    }
/*
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
    */
}