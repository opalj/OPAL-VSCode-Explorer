
static com.android.volley.RequestQueue newRequestQueue(android.content.Context,com.android.volley.toolbox.HttpStack,int){
      /* PARAMETERS:
         param1: useSites={6,1,5} (origin=-2)
         param2: useSites={19,31} (origin=-3)
         param3: useSites={32,40} (origin=-4)
      */
    0:/*pc=0:*/ lv0 = new File
    1:/*pc=5:*/ lv1 = {param1}/*android.content.Context*/.getCacheDir()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 1 →
    2:/*pc=8:*/ lv2 = "volley"
    3:/*pc=10:*/ {lv0}/*(non-virtual) java.io.File*/.<init>({lv1}, {lv2})
      // ⚡️ <uncaught exception ⇒ abnormal return>
   
4:/*pc=43343:*/
      // 3 →
    4:/*pc=14:*/ lv4 = "volley/0"
    5:/*pc=19:*/ lv5 = {param1}/*android.content.Context*/.getPackageName()
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 5 →
    6:/*pc=25:*/ lv6 = {param1}/*android.content.Context*/.getPackageManager()
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 6 →
    7:/*pc=30:*/ lv7 = 0
    8:/*pc=31:*/ lv8 = {lv6}/*android.content.pm.PackageManager*/.getPackageInfo({lv5}, {lv7})
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18
/*h({)}adjads*/
      // 8 →
    9:/*pc=35:*/ lv9 = new StringBuilder
   10:/*pc=39:*/ {lv9}/*(non-virtual) java.lang.StringBuilder*/.<init>()
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 10 →
   11:/*pc=44:*/ lvb = {lv9}/*java.lang.StringBuilder*/.append({lv5})
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      //11 →
   12:/*pc=47:*/ lvc = "/"
   13:/*pc=49:*/ lvd = {lvb}/*java.lang.StringBuilder*/.append({lvc})
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 13 →
   14:/*pc=53:*/ lve = {lv8}/*android.content.pm.PackageInfo*/.versionCode
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 14 →
   15:/*pc=56:*/ lvf = {lvd}/*java.lang.StringBuilder*/.append({lve})
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 15 →
   16:/*pc=59:*/ lv10 = {lvf}/*java.lang.StringBuilder*/.toString()
      // ⚡️ <uncaught exception ⇒ abnormal return>, ⚡️ android.content.pm.PackageManager$NameNotFoundException → 18

      // 16 →
   17:/*pc=64:*/ goto 19

      // android.content.pm.PackageManager$NameNotFoundException →
   18:/*pc=67:*/ caught android.content.pm.PackageManager$NameNotFoundException /* <= {exception@16,exception@8,exception@6,exception@10,exception@15,exception@11,exception@13,exception@5}*/

      // 17, 18 →
   19:/*pc=69:*/ if({param2} != null) goto 30

      // 19 →
   20:/*pc=72:*/ lv14 = android.os.Build$VERSION.SDK_INT
   21:/*pc=75:*/ lv15 = 9
   22:/*pc=77:*/ if({lv14} < {lv15}) goto 26

      // 22 →
   23:/*pc=80:*/ lv17 = new HurlStack
   24:/*pc=84:*/ {lv17}/*(non-virtual) com.android.volley.toolbox.HurlStack*/.<init>()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 24 →
      
   25:/*pc=88:*/ goto 30

      // 22 →
   26:/*pc=91:*/ lv1a = new HttpClientStack
   27:/*pc=97:*/ lv1b = android.net.http.AndroidHttpClient.newInstance({lv10, lv4})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 27 →
   28:/*pc=100:*/ {lv1a}/*(non-virtual) com.android.volley.toolbox.HttpClientStack*/.<init>({lv1b})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 28 →
   29:/*pc=103:*/ ;

      // 19, 25, 29 →
   30:/*pc=104:*/ lv1e = new BasicNetwork
   31:/*pc=109:*/ {lv1e}/*(non-virtual) com.android.volley.toolbox.BasicNetwork*/.<init>({lv1a, param2, lv17})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 31 →
   32:/*pc=115:*/ if({param3} >= 0) goto 38

      // 32 →
   33:/*pc=118:*/ lv21 = new RequestQueue
   34:/*pc=122:*/ lv22 = new DiskBasedCache
   35:/*pc=127:*/ {lv22}/*(non-virtual) com.android.volley.toolbox.DiskBasedCache*/.<init>({lv0})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 35 →
   36:/*pc=132:*/ {lv21}/*(non-virtual) com.android.volley.RequestQueue*/.<init>({lv22}, {lv1e})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 36 →
   37:/*pc=136:*/ goto 43

      // 32 →
   38:/*pc=139:*/ lv26 = new RequestQueue
   39:/*pc=143:*/ lv27 = new DiskBasedCache
   40:/*pc=149:*/ {lv27}/*(non-virtual) com.android.volley.toolbox.DiskBasedCache*/.<init>({lv0}, {param3})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 40 →
   41:/*pc=154:*/ {lv26}/*(non-virtual) com.android.volley.RequestQueue*/.<init>({lv27}, {lv1e})
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 41 →
   42:/*pc=157:*/ ;

      // 37, 42 →
   43:/*pc=159:*/ {lv26, lv21}/*com.android.volley.RequestQueue*/.start()
      // ⚡️ <uncaught exception ⇒ abnormal return>

      // 43 →
   44:/*pc=163:*/ return {lv26, lv21}

      /*
      ExceptionHandler([4, 17) → 18, android.content.pm.PackageManager$NameNotFoundException)
      */
}

