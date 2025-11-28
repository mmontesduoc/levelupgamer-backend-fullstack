@echo off
REM Compilar sin usar el wrapper de Maven
mvn -DskipTests clean package
pause
