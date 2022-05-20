echo %date%
set d1 = %date%
set yyyy=%date:~0,4%
set mm=%date:~5,2%
set dd=%date:~8,2%
set today=%date:~0,4%%date:~5,2%%date:~8,2%
set filetoday = %today%.bat