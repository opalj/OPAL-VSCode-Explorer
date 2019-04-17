
ThisBuild / scalaVersion     := "2.12.8"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organizationName := "TU Darmstadt"
ThisBuild / organization     := "org.opalj"

resolvers += "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
lazy val root = (project in file("."))
  .settings(
    name := "OPAL Command Server",
    libraryDependencies ++= Seq()
  )

resolvers += Classpaths.typesafeReleases

val ScalatraVersion = "2.6.4"
libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra" % ScalatraVersion,
  "org.scalatra" %% "scalatra-scalatest" % ScalatraVersion % "test",
  "ch.qos.logback" % "logback-classic" % "1.2.3" % "runtime",
  "org.eclipse.jetty" % "jetty-webapp" % "9.4.9.v20180320" % "container,compile",
  "javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided",
	"org.scalatra" %% "scalatra-json" % ScalatraVersion,
  "org.json4s"   %% "json4s-jackson" % "3.5.2",
  "com.typesafe" % "config" % "1.3.2",

  // OPAL dependencies 
  "org.scala-lang" % "scala-reflect" % scalaVersion.value,
  "org.scala-lang.modules" %% "scala-xml" % "1.1.1" % "runtime",
  "com.typesafe.play" %% "play-json" % "2.7.2" % "runtime",
  "com.iheart" %% "ficus" % "1.4.5"  % "runtime",
  "org.apache.commons" % "commons-text" % "1.6"  % "runtime",
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.1"  % "runtime",
  "it.unimi.dsi" % "fastutil" % "8.2.2" % "runtime",

)
enablePlugins(SbtTwirl)
enablePlugins(ScalatraPlugin)

assemblyMergeStrategy in assembly := {
  case x if Assembly.isConfigFile(x) =>
    MergeStrategy.concat
  case PathList(ps @ _*) if Assembly.isReadme(ps.last) || Assembly.isLicenseFile(ps.last) =>
    MergeStrategy.rename
  case PathList("META-INF", xs @ _*) =>
    (xs map {_.toLowerCase}) match {
      case ("manifest.mf" :: Nil) | ("index.list" :: Nil) | ("dependencies" :: Nil) =>
        MergeStrategy.discard
      case ps @ (x :: xs) if ps.last.endsWith(".sf") || ps.last.endsWith(".dsa") =>
        MergeStrategy.discard
      case "plexus" :: xs =>
        MergeStrategy.discard
      case "services" :: xs =>
        MergeStrategy.filterDistinctLines
      case ("spring.schemas" :: Nil) | ("spring.handlers" :: Nil) =>
        MergeStrategy.filterDistinctLines
      case _ => MergeStrategy.last
    }
  case _ => MergeStrategy.last
}