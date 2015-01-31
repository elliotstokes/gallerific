package com.vapidspace.gallerific

import _root_.akka.actor.ActorSystem
import org.scalatra._
import dispatch._
import Defaults._
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.{Failure, Success, Try}
import org.slf4j.{Logger, LoggerFactory}

class GallerificServlet(system: ActorSystem) extends ScalatraServlet with FutureSupport {
  
  val logger =  LoggerFactory.getLogger(getClass)

  protected implicit def executor: ExecutionContext = system.dispatcher

  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say <a href="hello-scalate">hello to Scalate</a>.
        <img src="http://localhost:8080/proxy?u=blah"/>
      </body>
    </html>
  }

  get("/proxy/?") {
  	logger.info("foo")
  	val u:String = params.getOrElse("u", halt(400))
  	new AsyncResult { val is =
      HttpClient.retrievePage(u)
    }
  }

  notFound {
  	<html>
  		<h1>Not bloody found innit</h1>
  	</html>
  	
  }

}

object HttpClient {

    def retrievePage(u:String)(implicit ctx: ExecutionContext): Future[Array[Byte]] = {
      val prom = Promise[Array[Byte]]()
      dispatch.Http(url("http://www.online-image-editor.com//styles/2014/images/example_image.png") OK as.Bytes) onComplete {
        case Success(content) => prom.complete(Try(content))
        case Failure(exception) => println(exception)
      }
      prom.future
    }
  }
