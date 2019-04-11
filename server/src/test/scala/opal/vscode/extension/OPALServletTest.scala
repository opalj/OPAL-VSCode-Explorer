import org.scalatra.test.scalatest._
import org.scalatest.FunSuiteLike
import opal.extension.vscode.servlet.OPALServlet;

import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.write
import opal.extension.vscode.model._
import java.io.File
import org.opalj.br.MethodDescriptor;
import org.opalj.collection.immutable.RefArray
import org.opalj.br._

class OPALServletTests extends ScalatraSuite with FunSuiteLike {

    implicit val formats = DefaultFormats

    addServlet(classOf[OPALServlet], "/*")

    var classesPath = new File(".").getCanonicalPath()+File.separator+"target"+File.separator+"scala-2.12"+File.separator+"classes";
    var testProject = new File(".").getCanonicalPath()+File.separator+".."+File.separator+"dummy";

    test("Load Project") {
        var json = "";
        //var opalInit = OpalInit("abc", Array(classesPath+File.separator+"JettyLauncher.class"), Array(""), Map("key" -> "value"));
        var opalInit = OpalInit("abc", Array(testProject+File.separator), Array(""), Map("key" -> "value")); // +"cmdsnake"+File.separator+"Direction.class"
        json = write(opalInit);

        post("/project/load", json) {
            body should equal ("Project loaded")
            status should equal (200)
        }

        var requestLogs = Log("abc", "", Map("key" -> "value"));
        json = write(requestLogs);
        post("/project/load/log", json) {
            body should ( include ("creating the project took") and include ("the JDK is part of the analysis") )
            status should equal (200)
        }
    }

    test("get tac and bc for class and call graph") {
        var json = "";
        //var opalInit = OpalInit("abc", Array(classesPath+File.separator+"JettyLauncher.class"), Array(""), Map("key" -> "value"));
        var opalInit = OpalInit("123", Array(testProject), Array(""), Map("key" -> "value")); // File.separator+"AirlineProblem.class"
        json = write(opalInit);

        post("/project/load", json) {
            body should equal ("Project loaded")
            status should equal (200)
        }

        var tacForClass = TACForClass("123", "AirlineProblem", "tacAI");
        json = write(tacForClass);
        post("/project/tac/class", json) {
            body should ( include("{lv36}/*java.io.PrintStream*/.println({lv41})") and include("{lv40}/*java.lang.StringBuilder*/.toString()") and include("java.lang.StringBuilder*/.<init>()"))
            status should equal (200)
        }

        var tacForClassString = TACForClass("123", "java/lang/String", "tacAI");
        json = write(tacForClassString);
        post("/project/tac/class", json) {
            //body should ( include("0:/*pc=-1:*/ r_0 = this") and include("void <init>()") and include("2:/*pc=1:*/ op_0/*(non-virtual) java.lang.Object*/.<init>()"))
            //status should equal (200)
        }

        tacForClass = TACForClass("123", "AirlineProblem", "");
        json = write(tacForClass);
        post("/project/tac/class", json) {
            body should ( include("op_2 = java.lang.System.in") and include("r_9 = op_0") and include("29:/*pc=58:*/ r_4 = op_0"))
            status should equal (200)
        }

        var bcForClass = OpalCommand("123", "getBCForMethod", Map("fqn" -> "AirlineProblem", "methodName" -> "main", "descriptor" -> "(): void"));
        json = write(bcForClass);
        post("/project/loadAny", json) {
            body should ( include("(117,INVOKEVIRTUAL(java.util.Scanner{ java.lang.String nextLine() })),"))
            status should equal (200)
        }

        var cgForClass = OpalCommand("123", "getCallGraph", Map("fqn" -> "AirlineProblem", "methodName" -> "main", "descriptor" -> "(): void"));
        json = write(cgForClass);
        post("/project/loadAny", json) {
            //body should ( include("xxx"))
            //status should equal (200)
        }

        var getBCForClassHTML = OpalCommand("123", "getBCForClassHTML", Map("fileName" -> "C:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\dummy\\Test.class", "className" -> "Test"));
        json = write(getBCForClassHTML);
        post("/project/loadAny", json) {
            body should ( include("<td> <span class=\"instruction return\">return</span></td>") and include("<span>{ <span class=\" object_type\">java.io.PrintStream</span> <span class=\"name\">out </span> }</span>"))
            status should equal (200)
        }
    } 

    test("method descriptor void") {
        //NoArgumentMethodDescriptor(VoidType)
    }

    test("method descriptor string void") {
        MethodDescriptor(RefArray(LongType,ByteType,ObjectType.String), BooleanType)
    }

    test ("get fqn from class file") {
        var filename = "C:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\scala-2.12\\classes\\opal\\extension\\vscode\\OPALProject.class";
        var getContextInfos = write(OpalCommand("123", "getContextInfos", Map("filename" -> filename)));
    
        post("/context/fqn", filename) {
            status should equal (200)
            body should equal ("opal/extension/vscode/OPALProject")
        }
    }
}