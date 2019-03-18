static void <clinit>(){
/* NO PARAMETERS */
    0:/*pc=0:*/ lv0 = com.android.volley.VolleyLog.DEBUG
    1:/*pc=3:*/ com.android.volley.VolleyLog$a.a = {lv0}
    2:/*pc=6:*/ return
}

void <init>(){
      /* PARAMETERS:
         param0: useSites={0,5,3} (origin=-1)
      */
    0:/*pc=1:*/ {param0}/*(non-virtual) java.lang.Object*/.<init>()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 0 →
    1:/*pc=5:*/ lv1 = new ArrayList
    2:/*pc=9:*/ {lv1}/*(non-virtual) java.util.ArrayList*/.<init>()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 2 →
    3:/*pc=12:*/ {param0}/*com.android.volley.VolleyLog$a*/.b = {lv1}
    4:/*pc=16:*/ lv4 = 0
    5:/*pc=17:*/ {param0}/*com.android.volley.VolleyLog$a*/.c = {lv4}
    6:/*pc=20:*/ return
}

void a(java.lang.String){
      /* PARAMETERS:
         param0: useSites={12,2,1,25,13,7,39} (origin=-1)
         param1: useSites={37} (origin=-2)
      */
    0:/*pc=1:*/ lv0 = 1
    1:/*pc=2:*/ {param0}/*com.android.volley.VolleyLog$a*/.c = {lv0}
    2:/*pc=8:*/ lv2 = {param0}/*com.android.volley.VolleyLog$a*/.b
    3:/*pc=11:*/ lv3 = {lv2}/*java.util.List*/.size()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 3 →
    4:/*pc=16:*/ if({lv3} != 0) goto 7

      // 4 →
    5:/*pc=19:*/ lv5 = 0l
    6:/*pc=20:*/ goto 21

      // 4 →
    7:/*pc=24:*/ lv7 = {param0}/*com.android.volley.VolleyLog$a*/.b
    8:/*pc=27:*/ lv8 = 0
    9:/*pc=28:*/ lv9 = {lv7}/*java.util.List*/.get({lv8})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 9 →
   10:/*pc=33:*/ (com.android.volley.VolleyLog$a$a) {lv9}
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 10 →
   11:/*pc=36:*/ lvb = {lv9}/*com.android.volley.VolleyLog$a$a*/.c
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 11 →
   12:/*pc=42:*/ lvc = {param0}/*com.android.volley.VolleyLog$a*/.b
   13:/*pc=46:*/ lvd = {param0}/*com.android.volley.VolleyLog$a*/.b
   14:/*pc=49:*/ lve = {lvd}/*java.util.List*/.size()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 14 →
   15:/*pc=54:*/ lvf = 1
   16:/*pc=55:*/ lv10 = {lve} - {lvf}
   17:/*pc=56:*/ lv11 = {lvc}/*java.util.List*/.get({lv10})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 17 →
   18:/*pc=61:*/ (com.android.volley.VolleyLog$a$a) {lv11}
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 18 →
   19:/*pc=64:*/ lv13 = {lv11}/*com.android.volley.VolleyLog$a$a*/.c
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 19 →
   20:/*pc=69:*/ lv14 = {lv13} - {lvb}

      // 20, 6 →
   21:/*pc=72:*/ lv15 = 0l
   22:/*pc=73:*/ lv16 = {lv14, lv5} cmp {lv15}
   23:/*pc=74:*/ if({lv16} > 0) goto 25

      // 23 →
   24:/*pc=77:*/ return

      // 23 →
   25:/*pc=79:*/ lv19 = {param0}/*com.android.volley.VolleyLog$a*/.b
   26:/*pc=82:*/ lv1a = 0
   27:/*pc=83:*/ lv1b = {lv19}/*java.util.List*/.get({lv1a})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 27 →
   28:/*pc=88:*/ (com.android.volley.VolleyLog$a$a) {lv1b}
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 28 →
   29:/*pc=91:*/ lv1d = {lv1b}/*com.android.volley.VolleyLog$a$a*/.c
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 29 →
   30:/*pc=96:*/ lv1e = "(%-4d ms) %s"
   31:/*pc=98:*/ lv1f = 2
   32:/*pc=99:*/ lv20 = new java.lang.Object[{lv1f}]
   33:/*pc=103:*/ lv21 = 0
   34:/*pc=105:*/ lv22 = java.lang.Long.valueOf({lv14, lv5})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 34 →
   35:/*pc=108:*/ {lv20}[{lv21}] = {lv22}
   36:/*pc=110:*/ lv24 = 1
   37:/*pc=112:*/ {lv20}[{lv24}] = {param1}
   38:/*pc=113:*/ com.android.volley.VolleyLog.d({lv1e}, {lv20})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 38 →
   39:/*pc=117:*/ lv27 = {param0}/*com.android.volley.VolleyLog$a*/.b
   40:/*pc=120:*/ lv28 = {lv27}/*java.util.List*/.iterator()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 40 →
   41:/*pc=125:*/ ;

      // 41, 62 →
   42:/*pc=127:*/ lv2a = {lv28}/*java.util.Iterator*/.hasNext()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 42 →
   43:/*pc=132:*/ if({lv2a} == 0) goto 63

      // 43 →
   44:/*pc=136:*/ lv2c = {lv28}/*java.util.Iterator*/.next()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 44 →
   45:/*pc=141:*/ (com.android.volley.VolleyLog$a$a) {lv2c}
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 45 →
   46:/*pc=146:*/ lv2e = {lv2c}/*com.android.volley.VolleyLog$a$a*/.c
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 46 →
   47:/*pc=151:*/ lv2f = "(+%-4d) [%2d] %s"
   48:/*pc=153:*/ lv30 = 3
   49:/*pc=154:*/ lv31 = new java.lang.Object[{lv30}]
   50:/*pc=158:*/ lv32 = 0
   51:/*pc=163:*/ lv33 = {lv2e} - {lv2e, lv1d}
   52:/*pc=164:*/ lv34 = java.lang.Long.valueOf({lv33})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 52 →
   53:/*pc=167:*/ {lv31}[{lv32}] = {lv34}
   54:/*pc=169:*/ lv36 = 1
   55:/*pc=171:*/ lv37 = {lv2c}/*com.android.volley.VolleyLog$a$a*/.b
   56:/*pc=174:*/ lv38 = java.lang.Long.valueOf({lv37})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 56 →
   57:/*pc=177:*/ {lv31}[{lv36}] = {lv38}
   58:/*pc=179:*/ lv3a = 2
   59:/*pc=181:*/ lv3b = {lv2c}/*com.android.volley.VolleyLog$a$a*/.a
   60:/*pc=184:*/ {lv31}[{lv3a}] = {lv3b}
   61:/*pc=185:*/ com.android.volley.VolleyLog.d({lv2f}, {lv31})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 61 →
   62:/*pc=192:*/ goto 42

      // 43 →
   63:/*pc=195:*/ return
}

void a(java.lang.String,long){
      /* PARAMETERS:
         param0: useSites={0,6} (origin=-1)
         param1: useSites={9} (origin=-2)
         param2: useSites={9} (origin=-3)
      */
    0:/*pc=1:*/ lv0 = {param0}/*com.android.volley.VolleyLog$a*/.c
    1:/*pc=4:*/ if({lv0} == 0) goto 6

      // 1 →
    2:/*pc=7:*/ lv2 = new IllegalStateException
    3:/*pc=11:*/ lv3 = "Marker added to finished log"
    4:/*pc=13:*/ {lv2}/*(non-virtual) java.lang.IllegalStateException*/.<init>({lv3})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 4 →
    5:/*pc=16:*/ throw {lv2}
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 1 →
    6:/*pc=18:*/ lv6 = {param0}/*com.android.volley.VolleyLog$a*/.b
    7:/*pc=21:*/ lv7 = new VolleyLog$a$a
    8:/*pc=27:*/ lv8 = android.os.SystemClock.elapsedRealtime()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 8 →
    9:/*pc=30:*/ {lv7}/*(non-virtual) com.android.volley.VolleyLog$a$a*/.<init>({param1}, {param2}, {lv8})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 9 →
   10:/*pc=33:*/ /*expression value is ignored:*/{lv6}/*java.util.List*/.add({lv7})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 10 →
   11:/*pc=39:*/ return
}

void finalize(){
      /* PARAMETERS:
         param0: useSites={0,3} (origin=-1)
      */
    0:/*pc=1:*/ lv0 = {param0}/*com.android.volley.VolleyLog$a*/.c
    1:/*pc=4:*/ if({lv0} != 0) goto 8

      // 1 →
    2:/*pc=8:*/ lv2 = "Request on the loose"
    3:/*pc=10:*/ {param0}/*com.android.volley.VolleyLog$a*/.a({lv2})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 3 →
    4:/*pc=13:*/ lv4 = "Marker log finalized without finish() - uncaught exit point for request"
    5:/*pc=15:*/ lv5 = 0
    6:/*pc=16:*/ lv6 = new java.lang.Object[{lv5}]
    7:/*pc=19:*/ com.android.volley.VolleyLog.e({lv4}, {lv6})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 1, 7 →
    8:/*pc=22:*/ return
}

