package com.vapidspace.gallerific

import _root_.akka.actor.ActorSystem
import org.scalatra._
import dispatch._
import Defaults._
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.{Failure, Success, Try}
import org.slf4j.{Logger, LoggerFactory}
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._

class ApiController() extends ScalatraServlet with JacksonJsonSupport {
  
  protected implicit val jsonFormats: Formats = DefaultFormats

  val logger =  LoggerFactory.getLogger(getClass)

  before() {
    contentType = formats("json")
  }

  get("/settings") {
    AppSettingsData.all
  }
 
  notFound {
  	serveStaticResource() getOrElse
  	status(404)
	  <html>
  		<h1>Not bloody found innit</h1>
  	</html>	
  }

}

case class AppSettings(proxy: String, proxyParam: String)

object AppSettingsData {

  var all = AppSettings("/proxy", "u")
}
