@echo off
setlocal enabledelayedexpansion
set "line="
for /l %%i in (1,1,5000) do set "line=!line!a"
echo !line!
