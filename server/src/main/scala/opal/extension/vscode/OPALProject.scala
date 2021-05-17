package opal.extension.vscode

import opal.extension.vscode.model._
import org.json4s.DefaultFormats
import org.json4s.jackson.Serialization.write
import org.opalj.bi.AccessFlags
import org.opalj.br.{MethodDescriptor, ObjectType}
import org.opalj.br.analyses.Project.JavaClassFileReader
import org.opalj.br.analyses._
import org.opalj.br.reader.Java9Framework
import org.opalj.log.{LogContext, LogMessage, OPALLogger}
import org.opalj.tac.{LazyDetachedTACAIKey, ToTxt}

import java.io.File
import java.nio.charset.CodingErrorAction
import scala.io.Codec


/**
 * Link to OPAL
 * Every instance of this class represents a Project that is analyzed by OPAL
 *
 * @param opalInit : OPAL initialization Message
 */
class OPALProject(opalInit: OpalInit) {

  protected val logger = new StringLogger();
  protected var project: Project[java.net.URL] = null;
  implicit val formats = DefaultFormats

  /**
   * Let OPAL load / analyze the Project with the opalInit Message
   * */
  def load(): String = {
    var libraryClassFilesAreInterfacesOnly = false
    var libraryClassFilesAreInterfacesOnlyMSG = ""
    var jdkAsLib = false
    var jdkAsLibMSG = ""
    var res = "Project loaded"

    opalInit.config.get("libraryClassFilesAreInterfacesOnly") match {
      case Some("1") | Some("true") =>
        libraryClassFilesAreInterfacesOnly = true;
        libraryClassFilesAreInterfacesOnlyMSG = " and library class files are Interfaces only";
      case _ =>
    }

    opalInit.config.get("jdk.loadAsLib") match {
      case Some("1") | Some("true") =>
        jdkAsLib = true;
        jdkAsLibMSG = " as library";
      case _ =>
    }

    val targetClassFiles = JavaClassFileReader().AllClassFiles(opalInit.targets.map(new File(_)))
    opalInit.config.get("jdk.load") match {
      case Some("1") | Some("true") =>
        if (jdkAsLib) {
          val libraryClassFiles = Java9Framework.AllClassFiles(opalInit.libraries.map(new File(_)) :+ org.opalj.bytecode.RTJar)
          project = Project(
            targetClassFiles,
            libraryClassFiles,
            libraryClassFilesAreInterfacesOnly,
            virtualClassFiles = Traversable.empty)(projectLogger = logger);
        } else {
          val libraryClassFiles = Java9Framework.AllClassFiles(opalInit.libraries.map(new File(_)) :+ org.opalj.bytecode.RTJar)
          project = Project(
            targetClassFiles,
            libraryClassFiles,
            libraryClassFilesAreInterfacesOnly,
            virtualClassFiles = Traversable.empty)(projectLogger = logger);
        }
        res += " with JDK";
      case _ =>
        val libraryClassFiles = Java9Framework.AllClassFiles(opalInit.libraries.map(new File(_)))
        project = Project(
          targetClassFiles,
          libraryClassFiles,
          libraryClassFilesAreInterfacesOnly,
          virtualClassFiles = Traversable.empty)(projectLogger = logger);
        res += " without JDK";
    }
    res + jdkAsLibMSG + libraryClassFilesAreInterfacesOnlyMSG
  }

  /**
   * Get the Logs from OPAl
   */
  def getLog(): String = {
    var logs = logger.getLogs;
    logger.flushLogs();
    logs;
  }

  /**
   * Get the TAC of a Method
   * */
  def getTacForMethod(tacForMethod: TACForMethod): String = {
    val tacAI = project.get(LazyDetachedTACAIKey)
    project.allClassFiles.find(_.fqn == tacForMethod.fqn).get.findMethod(tacForMethod.methodName, MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
    val tac = project.allClassFiles.find(_.fqn == tacForMethod.fqn).get.findMethod(tacForMethod.methodName, MethodDescriptor(tacForMethod.descriptor)).map(tacAI(_)).get
    ToTxt(tac).mkString("\n")
  }

  /**
   * Get the TAC of a Class
   * */
  def getTacForClass(tacForClass: TACForClass): String = {
    val tacAI = project.get(LazyDetachedTACAIKey)

    val cf = project.classFile(ObjectType(tacForClass.fqn.replace('.', '/')))
    var res = ""
    if (cf.isEmpty) {
      res = "Class File for fqn = " + tacForClass.fqn + " not found!";
    } else {
      val superClass = cf.get.superclassType.get.toJava
      val access = AccessFlags.classFlagsToJava(cf.get.accessFlags)
      val jdkVersion = org.opalj.bi.jdkVersion(cf.get.majorVersion)
      var interfaces = "";



      res += s"Version: $jdkVersion\n"
      //res += s"Access: $access\n"
      val fqn = tacForClass.fqn.replace('/', '.');
      //res += s"Fully Qualified Name: $fqn\n"
      res += s"Super Class: $superClass\n"
      if (cf.get.interfaceTypes.toList.length > 0) {
        cf.get.interfaceTypes.toList.foreach({
          interface =>
            interfaces += interface.fqn.replace('/', '.')
        })
        res += s"Interfaces: $interfaces\n"
      }
      res += access + " " + tacForClass.fqn.replace('/', '.') + " {\n"
      /*
      if (interfaces != "") {
          res += " implements " + interfaces
      }
      res += " {\n"
      */
      if (cf.get.fields.length > 0) {
        res += "Fields: \n"
        cf.get.fields.foreach({
          field =>
            val fieldName = field.name
            val fieldType = field.fieldType
            res += "\t - " + field.name + " " + field.fieldType + "\n"
        });
        res += "\n"
      }

      cf.get.methods.foreach({
        m =>
          if (!m.isFinal && !m.isAbstract) {
            res += (if (m.isStatic) "static " else "") + m.descriptor.toJava(m.name);
            res += "\n{\n";
            tacForClass.version match {
              case "lazyDetachedTACai" =>
                var tac = tacAI(m);
                res += ToTxt(tac).mkString("\n");
              case _ =>
                res += ToTxt(m)
            }
            res += "\n}\n"
          }
      })
    }
    res + "}"
  }

  /**
   * Implementation of the get byte code command
   * Get byte code command can be triggered using the any command through the loadAny route at the OPALServlet.
   * The params Map must contain:
   * -> The fully qualified name of the class that contains the method
   * -> The name of the Method for which you want the byte code
   * -> The descriptor of the method to id the correct method (two methods can have the same name)
   * */
  def getBCForMethod(opalCommand: OpalCommand): String = {
    var res = "";
    if (!opalCommand.params.contains("fqn")) {
      res = "Missing fqn (fully qualified name)"
    } else if (!opalCommand.params.contains("methodName")) {
      res = "Missing method name"
    } else if (!opalCommand.params.contains("descriptor")) {
      res = "Missing Method descriptor"
    } else {
      var fqn = opalCommand.params.get("fqn").get;
      var methodName = opalCommand.params.get("methodName").get;
      var descriptor = opalCommand.params.get("descriptor").get;
      var cf = project.allClassFiles.find(_.fqn == fqn);
      if (cf.isEmpty) {
        res = "Class File for fqn = " + fqn + " not found!";
      } else {
        //var method = cf.get.findMethod(methodName,MethodDescriptor(descriptor));
        cf.get.methods.foreach({
          method =>
            if (method.name == methodName) { //@TODO: check method descriptor to id method
              //res = write(method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep);
              res = method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep.toString
            }
        })
      }
    }
    res
  }

  /**
   * Implementation of the get byte code command
   * Get byte code command can be triggered using the any command through the loadAny route at the OPALServlet.
   * The params Map must contain:
   * -> The fully qualified name of the class that contains the method
   * */
  def getBCForClass(opalCommand: OpalCommand): String = {
    var res = "";
    if (!opalCommand.params.contains("fqn")) {
      res = "Missing fqn (fully qualified name)"
    } else {
      var fqn = opalCommand.params.get("fqn").get;
      var cf = project.allClassFiles.find(_.fqn == fqn);
      if (cf.isEmpty) {
        res = "Class File for fqn = " + fqn + " not found!";
      } else {
        var bytecode = Map[String, String]();
        cf.get.methods.foreach({
          method =>
            var instructions = method.body.get.instructions.zipWithIndex.filter(_._1 ne null).map(_.swap).deep.toString
            var exceptions = method.body.get.exceptionHandlers.toString;
            var attributes = method.body.get.attributes.toString;
            var methodBC = Map("instructions" -> instructions, "exceptions" -> exceptions, "attributes" -> attributes);
            bytecode += (method.name -> write(methodBC));
        });
        res = write(bytecode);
      }
    }
    res
  }

  /**
   * Implementation of the get byte code command
   * Get byte code command can be triggered using the any command through the loadAny route at the OPALServlet.
   * The params Map must contain:
   * -> The fully qualified name of the class that contains the method
   * */
  def getBCForClassHTML(opalCommand: OpalCommand): String = {
    var res = "";
    if (!opalCommand.params.contains("fileName")) {
      res = "Missing target File Name"
    } else if (!opalCommand.params.contains("className")) {
      res = "Missing class Name";
    } else {
      var fileName = opalCommand.params.get("fileName").get
      var className = opalCommand.params.get("className").get

      val classFileFilter =
        if (className == null)
          (cf: org.opalj.da.ClassFile) ⇒ true // just take the first one...
        else
          (cf: org.opalj.da.ClassFile) ⇒
            cf.thisType.asJava == className.replace("/", ".")

      implicit val codec = Codec("UTF-8")
      codec.onMalformedInput(CodingErrorAction.REPLACE)
      codec.onUnmappableCharacter(CodingErrorAction.REPLACE)

      org.opalj.da.ClassFileReader.findClassFile(List(new java.io.File(fileName)), println, classFileFilter, (cf: org.opalj.da.ClassFile) ⇒ cf.thisType.asJava)
      match {
        case Left(cfSource) ⇒
          val htmlCSS = Some(org.opalj.da.ClassFile.TheCSS + ".class_file {background: white;}")
          res = cfSource._1.toXHTML(Some(cfSource._2), htmlCSS, Some(""), Some(""), false).toString
        case Right(altClassNames) ⇒
          res = "cannot find class " + className + " in " + altClassNames;
      }
    }
    res
  }

  def getCFG(opalCommand: OpalCommand): String = {
    var res = "";
    if (!opalCommand.params.contains("fqn")) {
      res = "Missing fqn (fully qualified name)"
    } else if (!opalCommand.params.contains("methodName")) {
      res = "Missing method name"
    } else if (!opalCommand.params.contains("descriptor")) {
      res = "Missing Method descriptor"
    } else {
      var fqn = opalCommand.params.get("fqn").get;
      var methodName = opalCommand.params.get("methodName").get;
      var descriptor = opalCommand.params.get("descriptor").get;
      var cf = project.allClassFiles.find(_.fqn == fqn);
      if (cf.isEmpty) {
        res = "Class File for fqn = " + fqn + " not found!";
      } else {
        val cfg = org.opalj.br.cfg.CFGFactory(cf.get.methods.tail.head.body.get)
        val svg = org.opalj.graphs.dotToSVG(cfg.toDot);
        res = svg;
      }
    }
    res
  }

  /**
   * Get the Any
   * */
  def getAny(opalCommand: OpalCommand): String = {
    var tacString = new StringBuilder();
    var command = opalCommand.command;
    var res = "";
    command match {
      case "getCFG" => res = getCFG(opalCommand);
      case "getSVG" => res = "";
      case "getBCForClass" => res = getBCForClass(opalCommand);
      case "getBCForMethod" => res = getBCForMethod(opalCommand);
      case "getBCForClassHTML" => res = getBCForClassHTML(opalCommand);
      // case "getCallGraph" => res = getCallGraph(opalCommand);
      // case "getContextInfos" => res = getClassFileContext(opalCommand);
      case _ => res = "unknown command";
    }

    res.mkString("");
  }
}

/*
 * This is a small implementation of the OPAL Logger.
 * This is necessary for providing the logs to the client (in a different process)
 */
class StringLogger extends OPALLogger {

  protected var logCache = "";

  override def log(message: LogMessage)(implicit ctx: LogContext): Unit = {
    logCache = logCache + message.message + "\n";
  }

  def flushLogs(): Unit = {
    logCache = "";
  }

  def getLogs(): String = {
    logCache;
  }
}