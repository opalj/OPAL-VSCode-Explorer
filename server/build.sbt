
import Dependencies._

ThisBuild / scalaVersion     := "2.12.8"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organizationName := "TU"
ThisBuild / organization     := "org.opalj"

resolvers += "Sonaotype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
lazy val root = (project in file("."))
  .settings(
    name := "OPAL Command Server",
    libraryDependencies ++= Seq(
	scalaTest % Test
	)
  )

resolvers += Classpaths.typesafeReleases

val ScalatraVersion = "2.6.4"
libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra" % ScalatraVersion,
  "org.scalatra" %% "scalatra-scalatest" % ScalatraVersion % "test",
  "ch.qos.logback" % "logback-classic" % "1.2.3" % "runtime",
  "org.eclipse.jetty" % "jetty-webapp" % "9.4.9.v20180320" % "container",
  "javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided",
	"org.scalatra" %% "scalatra-json" % ScalatraVersion,
  "org.json4s"   %% "json4s-jackson" % "3.5.2",
  "junit"                      % "junit"                   % "4.5",
  "org.scalatest"              % "scalatest_2.11"          % "2.2.0-RC2",
  "org.scalatest" %% "scalatest" % "2.1.6" % "test"
)
enablePlugins(SbtTwirl)
enablePlugins(ScalatraPlugin)

testOptions in Test <+= (target in Test) map {
  t => Tests.Argument(TestFrameworks.ScalaTest, "junitxml(directory=\"%s\")" format (t / "../shippable/testresults"))
}



// See https://www.scala-sbt.org/1.x/docs/Using-Sonatype.html for instructions on how to publish to Sonatype.
