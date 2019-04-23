package opal.extension.vscode.model;
import scala.collection.mutable.HashMap;

/**
 * Message for Loading the Project
 * projectId: The ID of the Project that will be loaded / analyzed by OPAL
 * targets: Array of Paths to class Files. These class Files are getting analyzed by OPAL
 * libraries: Libraries are jar Files that may necessary for analyzing target Files
 * config: additional config parameters for OPAL
 **/
case class OpalInit(projectId: String, targets: Array[String], libraries: Array[String], config: Map[String, String]);

/**
 * Message for getting the TAC for a Method
 * projectId: The ID of the Project that will be loaded / analyzed by OPAL
 * fqn: fully qualified name of a method
 * methodName: name of the method
 * descriptor: descriptor of the method
 **/
case class TACForMethod(projectId: String, fqn: String, methodName:String, descriptor : String)

/**
 * Message for getting the tac of a class
 * projectId: The ID of the Project that will be loaded / analyzed by OPAL
 * fqn: fully qualified name of the class
 * className: Name of the class
 **/
case class TACForClass(projectId: String, fqn:String, version : String)

/**
 * Message for requesting the Logs
 **/
case class Log(projectId: String, target: String, config: Map[String, String]);


/**
 * Command for any functionality
 **/
case class OpalCommand(projectId: String, command: String, params: Map[String, String]);

/**
 * Getting the context from all classes
 **/
case class ClassContext(path : String, infos: HashMap[String, String]);