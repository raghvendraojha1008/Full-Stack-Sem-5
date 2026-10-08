@echo off
title Backend - Spring Boot (port 8080)
cd /d "%~dp0backend"
echo Starting the Spring Boot backend. The first run downloads Maven and libraries, so it can take a few minutes.
call mvnw.cmd spring-boot:run
pause
