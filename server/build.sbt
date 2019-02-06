resolvers += "Sonaotype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
import Dependencies._

ThisBuild / scalaVersion     := "2.12.8"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "com.example"
ThisBuild / organizationName := "example"

lazy val root = (project in file("."))
  .settings(
    name := "OPAL Command Server",
    libraryDependencies ++= Seq(
	scalaTest % Test,
	opal_common,
	opal_br,
	opal_ai,
	opal_ba,
	opal_bi,
	opal_da,
	opal_tac,
	opal_bc,
	opal_sai
	)
  )

// See https://www.scala-sbt.org/1.x/docs/Using-Sonatype.html for instructions on how to publish to Sonatype.
