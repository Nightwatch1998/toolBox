echo open 121.40.123.74>ftp.txt
echo mht.cherry>>ftp.txt
echo mht.cherry>>ftp.txt
REM %1 代表第一个参数 %2代表第二个参数 依次类推
echo cd %3>>ftp.txt
REM 这里主要处理掉 file list 中的前后双引号
set tmp=%1
set "tmp=%tmp:"=%"
REM 如果要关闭交互，那么就用 prompt off
REM echo prompt off>>ftp.txt 
REM mdelete 删除的格式 mdelete 1.txt 2.txt 3.txt 
echo mdelete %tmp%>>ftp.txt 
echo bye>>ftp.txt
echo quit>>ftp.txt
echo exit>>ftp.txt
ftp -i -s:ftp.txt >>%2
del ftp.txt