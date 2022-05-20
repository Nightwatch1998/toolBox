set today=%date:~0,4%%date:~5,2%%date:~8,2%.bat
echo %today%
ftp -n -s:"download.bat"