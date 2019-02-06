import sbt._


object Dependencies {
 

  lazy val OPAL_VERSION = "3.0.0-SNAPSHOT"

  lazy val scalaTest = "org.scalatest" %% "scalatest" % "3.0.5"
  lazy val opal_common = "de.opal-project" %% "common" % OPAL_VERSION
  lazy val opal_br = "de.opal-project" %% "bytecode-representation" % OPAL_VERSION
  lazy val opal_ai = "de.opal-project" %% "abstract-interpretation-framework" % OPAL_VERSION
  lazy val opal_ba = "de.opal-project" %% "bytecode-assembler" % OPAL_VERSION
  lazy val opal_bi = "de.opal-project" %% "bytecode-infrastructure" % OPAL_VERSION
  lazy val opal_da = "de.opal-project" %% "bytecode-disassembler" % OPAL_VERSION
  lazy val opal_tac = "de.opal-project" %% "three-address-code" % OPAL_VERSION
  lazy val opal_bc = "de.opal-project" %% "bytecode-creator" % OPAL_VERSION
  lazy val opal_sai = "de.opal-project" %% "static-analysis-infrastructure" % OPAL_VERSION
}
