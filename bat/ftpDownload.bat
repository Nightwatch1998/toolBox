set today=%date:~0,4%%date:~5,2%%date:~8,2%.dat
set ftpscript=%TEMP%\ftp.txt
echo fengnan> %ftpscript%
echo forecast>> %ftpscript%
echo lcd f:/water_power>> %ftpscript%
echo get %today%>> %ftpscript%
echo quit>> %ftpscript%
ftp -s:%ftpscript% 8.131.236.41 