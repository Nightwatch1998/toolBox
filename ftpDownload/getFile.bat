@echo off
REM 配置基本盘符，主目录和文件存放目录
set BASE=f:
set BASE_PATH=F:\water_power\test
set LOG_FILE=%BASE_PATH%\ftpgetfile.log
 
set FLAG_FILE=%BASE_PATH%\tmp.tmp
set SA~VE_PATH=%BASE_PATH%\download
set TMP_PATH=%BASE_PATH%\temp
REM 远程的目录
set REMOTE_PATH=/
REM 程序开始运行
echo =========================================================== >> %LOG_FILE%
set mydate=%date:~0,10% %time:~0,8%
echo "Program is running start time:%mydate%" >> %LOG_FILE%
%BASE%
if not exist %BASE_PATH% (
  mkdir %BASE_PATH%
)
if not exist %SA~VE_PATH% (
  mkdir %SA~VE_PATH%
)
if not exist %TMP_PATH% (
  mkdir %TMP_PATH%
)
cd %TMP_PATH%
REM 程序执行之前设置的标志位 为 0
echo 0 > %FLAG_FILE%
if not exist %SA~VE_PATH% (
echo 无法找到标志文件%SA~VE_PATH% >> %LOG_FILE%
goto _END
)
ftp -s:"%BASE_PATH%\getfile.ftp" >> %LOG_FILE%
echo 本次获得的文件如下：>> %LOG_FILE%
dir /B %TMP_PATH%\*.* > %BASE_PATH%\filelist.tmp 
setlocal EnableDelayedExpansion
set count=0
FOR /F  "delims=" %%i IN (%BASE_PATH%\filelist.tmp) DO (
    set /a count+= 1
)
if %count% == 0 (
    echo "NO files need download!" >> %LOG_FILE%
    exit
)
dir /B %TMP_PATH%\*.* >> %LOG_FILE%
REM 把下载的文件拷贝到其它的目录
move /Y %TMP_PATH%\*.* %SA~VE_PATH%\
set num=1
set filelist=
FOR /F "delims=" %%i IN (%BASE_PATH%\filelist.tmp) DO (
    set filelist=!filelist! %%i
    REM 以5个文件为一组进行删除
    set /a tmp = !num! %% 5
    if !tmp! == 0 (
        call %BASE_PATH%\removefile.bat "!filelist!" %LOG_FILE% %REMOTE_PATH%
        set filelist=
    ) else (
        REM 如果文件的总个数与 num的数相等，并且不能达到5个文件为一组，那么就直接删除
        if !count! LEQ !num! (
            call %BASE_PATH%\removefile.bat "!filelist!" %LOG_FILE% %REMOTE_PATH%
            set filelist=
        )
    )
    set /a num+= 1
)
endlocal 
REM 程序执行完成之后设置标志位为1
echo 1 > %FLAG_FILE%
REM del %BASE_PATH%\filelist.tmp 删除下载的文件列表
set mydate=%date:~0,10% %time:~0,8%
echo =========================================================== >> %LOG_FILE%
echo "Program is running end:%mydate%" >> %LOG_FILE%
exit