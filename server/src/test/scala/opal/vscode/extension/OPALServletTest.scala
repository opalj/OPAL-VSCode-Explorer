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

    test("Load Project and get TAC for Class") {
        var json = "";
        //var opalInit = OpalInit("abc", Array(classesPath+File.separator+"JettyLauncher.class"), Array(""), Map("key" -> "value"));
        var opalInit = OpalInit("abc", Array(testProject+File.separator), Array(""), Map("key" -> "value")); // +"cmdsnake"+File.separator+"Direction.class"
        json = write(opalInit);

        post("/project/load", json) {
            body should equal ("Project loaded")
            status should equal (200)
        }

        var tacForClass = TACForClass("abc", "cmdsnake/Direction");
        json = write(tacForClass);
        post("/project/tac/class", json) {
            body should ( include("4:/*pc=7:*/ op_0/*(non-virtual) cmdsnake.Direction*/.<init>(op_2, op_3)") and include("13:/*pc=29:*") and include("5:/*pc=9:*/ return op_0"))
            status should equal (200)
        }



        var requestLogs = Log("abc", "", Map("key" -> "value"));
        json = write(requestLogs);
        post("/project/load/log", json) {
            body should include ("initialization of DefaultTACAI took")
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

        var tacForClass = TACForClass("123", "AirlineProblem");
        json = write(tacForClass);
        post("/project/tac/class", json) {
            body should ( include("0:/*pc=-1:*/ r_0 = this") and include("void <init>()") and include("2:/*pc=1:*/ op_0/*(non-virtual) java.lang.Object*/.<init>()"))
            status should equal (200)
        }

        var tacForClassString = TACForClass("123", "java/lang/String");
        json = write(tacForClassString);
        post("/project/tac/class", json) {
            body should ( include("0:/*pc=-1:*/ r_0 = this") and include("void <init>()") and include("2:/*pc=1:*/ op_0/*(non-virtual) java.lang.Object*/.<init>()"))
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

        var bcForMethod = OpalCommand("123", "getBCForClass", Map("fqn" -> "AirlineProblem"));
        json = write(bcForMethod);
        post("/project/loadAny", json) {
            body should ( include("(117,INVOKEVIRTUAL(java.util.Scanner{ java.lang.String nextLine() })),"))
            status should equal (200)
        }
    } 

    test("method descriptor void") {
        //NoArgumentMethodDescriptor(VoidType)
    }

    test("method descriptor string void") {
        MethodDescriptor(RefArray(LongType,ByteType,ObjectType.String), BooleanType)
    }
}