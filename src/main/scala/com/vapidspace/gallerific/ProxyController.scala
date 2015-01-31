package com.vapidspace.gallerific

import _root_.akka.actor.ActorSystem
import org.scalatra._
import dispatch._
import Defaults._
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.{Failure, Success, Try}
import org.slf4j.{Logger, LoggerFactory}

class ProxyController(system: ActorSystem) extends ScalatraServlet with FutureSupport {
  
  //protected implicit val jsonFormats: Formats = DefaultFormats
  protected implicit def executor: ExecutionContext = system.dispatcher

  val logger =  LoggerFactory.getLogger(getClass)

  get("/proxy/?") {
  	val u:String = params.getOrElse("u", halt(400))
  	logger.info("Proxying")
  	new AsyncResult { val is = 
  		HttpClient.retrievePage(u)
    }
  }
}

object HttpClient {

    def retrievePage(u: String)(implicit ctx: ExecutionContext): Future[Array[Byte]] = {
      val prom = Promise[Array[Byte]]()

      dispatch.Http(url(u) OK as.Bytes) onComplete {
        case Success(content) => prom.complete(Try(content))
        case Failure(exception) => println(exception)
      }
      prom.future
    }
  }
