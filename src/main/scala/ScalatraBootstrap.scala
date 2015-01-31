import _root_.akka.actor.ActorSystem
import com.vapidspace.gallerific._
import org.scalatra._
import javax.servlet.ServletContext

class ScalatraBootstrap extends LifeCycle {

  val system = ActorSystem()

  override def init(context: ServletContext) {
    context.mount(new GallerificServlet(system), "/*")

  }

   override def destroy(context:ServletContext) {
    system.shutdown()
  }
}
