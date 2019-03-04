package opal.extension.vscode.model;

case class OpalInit(projectID: String, targets: Array[String], libraries: Array[String], config: Map[String, String]);
case class TACForMethod(projectId:String, fqn: String, methodName:String, descriptor : String)
case class TACForClass(projectId:String, fqn:String, className:String, descriptor : String)
case class Log(projectID: String, target: String, config: Map[String, String]);