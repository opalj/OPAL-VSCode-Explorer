# opal-vscode-explorer README

## SERVER

# Installation

1. git repo clonen oder pullen
1. sbt installieren: https://www.scala-sbt.org/download.html
sbt ist quasi das maven für scala

Auf der Kommandzeile:
1. cd server
1. sbt
1. sbt:OPAL Command Server> erscheint
1. Jetty starten: mit dem Befehl:  jetty:start 
1. Jetty eventuell beenden mit jetty:stop
1. Jetty automatisch neustarten lasen: ~;jetty:stop;jetty:start

Statische TAC Dateien (siehe Web Ordner server\src\main\webapp):

http://localhost:8080/tac-examples/

TAC Servlet (siehe Ordner server\src\main\scala\opal\extension\vscode\)

http://localhost:8080/tac/blabla


Mehr Infos: http://scalatra.org//

# Tests

TODO


http://scalatra.org/guides/2.3/testing/scalatest.html