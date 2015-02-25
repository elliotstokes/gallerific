# Gallerific #

Gallerific is an application that allows you to convert your instagram photos into a 3d art gallery.

It is made up of two parts. The front end is a webgl client web application using THREE.js

THe back end (primarily to implement a proxy) is written in Scala.

The application should be running on heroku

[https://gallerific.herokuapp.com](https://gallerific.herokuapp.com)

##Key features

- Generates a random gallery using the spanning tree maze algorithm
- populates gallery with photos from instagrams popular section.
- Uses some post-processing filters to add a film grain effect.

##Limitations & Bugs##

- Currently it is just limited to the most popular photos on instagram.
- Collision Detection is a bit buggy and you can get stuck in the wall in some places.

## Build & Run ##

```sh
$ cd Gallerific
$ sbt
> container:start
> browse
```

If `browse` doesn't launch your browser, manually open [http://localhost:8080/](http://localhost:8080/) in your browser.
