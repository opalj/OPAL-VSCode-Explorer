import opal.extension.vscode._
import org.scalatra._
import javax.servlet.ServletContext

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.mount(new TACServlet, "/tac/*")
    context.mount(new InitOPALServlet, "/opal/*")
  }
}
