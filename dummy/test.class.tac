java.lang.String load()
{
      /* PARAMETERS:
         param0: useSites={80,152,36,2,130,50,118,65,17,113,157,7,55} (origin=-1)
      */
    0: lv0 = "Project loaded"
    1: lv1 = ""
    2: lv2 = {param0}/*opal.extension.vscode.OPALProject*/.opalInit
    3: lv3 = {lv2}/*opal.extension.vscode.model.OpalInit*/.config()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 3 →
    4: lv4 = "libraryClassFilesAreInterfacesOnly"
    5: lv5 = {lv3}/*scala.collection.immutable.Map*/.contains({lv4})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 5 →
    6: if({lv5} == 0) goto 28

      // 6 →
    7: lv7 = {param0}/*opal.extension.vscode.OPALProject*/.opalInit
    8: lv8 = {lv7}/*opal.extension.vscode.model.OpalInit*/.config()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 8 →
    9: lv9 = "libraryClassFilesAreInterfacesOnly"
   10: lva = {lv8}/*scala.collection.immutable.Map*/.get({lv9})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 10 →
   11: lvb = {lva}/*scala.Option*/.get()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 11 →
   12: lvc = "1"
   13: if({lvb} != null) goto 15

      // 13 →
   14: goto 28

      // 13 →
   15: lvf = {lvb}/*java.lang.Object*/.equals({lvc})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 15 →
   16: if({lvf} == 0) goto 28

      // 16 →
   17: lv11 = {param0}/*opal.extension.vscode.OPALProject*/.opalInit
   18: lv12 = {lv11}/*opal.extension.vscode.model.OpalInit*/.config()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 18 →
   19: lv13 = "libraryClassFilesAreInterfacesOnly"
   20: lv14 = {lv12}/*scala.collection.immutable.Map*/.get({lv13})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 20 →
   21: lv15 = {lv14}/*scala.Option*/.get()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 21 →
   22: lv16 = "true"
   23: if({lv15} != null) goto 25

      // 23 →
   24: goto 28

      // 23 →
   25: lv19 = {lv15}/*java.lang.Object*/.equals({lv16})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 25 →
   26: if({lv19} == 0) goto 28

      // 26 →
   27: lv1b = " and library Class files are Interfaces only"

      // 14, 16, 24, 26, 27, 6 →
   28: lv1c = org.opalj.br.analyses.Project$.MODULE$
   29: lv1d = org.opalj.br.analyses.Project$.MODULE$
   30: lv1e = {lv1d}/*org.opalj.br.analyses.Project$*/.JavaClassFileReader$default$1()
      // ⚡️ <uncaught exception ⇒ abnormal return>
}