from ftplib import FTP
import os
import datetime
import time

class FTP_OP(object):
	def __init__(self, host, username, password, port):
		"""
		初始化ftp
		:param host: ftp主机ip
		:param username: ftp用户名
		:param password: ftp密码
		:param port : ftp端口(默认21)
		"""
		self.host = host
		self.username = username
		self.password = password
		self.port = port
	def ftp_connect(self):
		"""
		连接ftp
		"return:
		"""
		ftp = FTP()
		ftp.set_debuglevel(0) # 不开启调试模式
		ftp.connect(host=self.host, port=self.port) # 连接ftp
		ftp.login(self.username, self.password) # 登录ftp
		return ftp
	
	def download_file(self, ftp_file_path, dst_file_path, temp_ftp_file_name):
		"""
		从ftp下载文件到本地
		:param ftp_file_path: ftp下载文件路径
		:param dst_file_path: 本地存放路径
		:return:
		"""
		buffer_size = 10240 #默认是8192
		ftp = self.ftp_connect()
		# print ftp.getwelcome() # 显示登录ftp信息
		file_list = ftp.nlst(ftp_file_path)
		print(file_list)
		for file_name in file_list:
			ftp_file = os.path.join(ftp_file_path, file_name)
			file_name = os.path.basename(file_name)
			write_file = os.path.jion(dst_file_path+file_name)
			#print write_file
			if file_name.find(temp_ftp_file_name) > -1 and not os.path.exists(write_file):
				print("file_name:" + write_file) 
				# ftp_file = os.path.join(ftp_file_path, file_name)
				# write_file = os.path.join(dst_file_path, file_name)
				with open(write_file, "wb") as f:
					ftp.retrbinary('RETR {0}'.format(ftp_file), f.write,  buffer_size)
				f.close()
		
if __name__ == '__main__':
    # FTP服务器IP
    host = "8.131.236.41"
    # 账号
    username = 'fengnan'
    # 密码
    password = 'forecast'
    # 端口
    port = 21
    # 从FTP服务器下载的文件目录
    ftp_file_path = "/"
    # 文件下载到本地存储的目录
    dst_file_path = "f:/water_power"
    # 需要下载文件的前缀
    # 获取当天的前一天的日期
    now_date = (datetime.date.today() + datetime.timedelta(days = 0)).strftime('%Y%m%d')
    file_name_today = now_date + '.dat'
    ftp = FTP_OP(host, username, password, port)

    # for pre in list:
    # #print(pre)
    #     temp_ftp_file_name = pre + '_' + now_date + '.txt'
    # # print temp_ftp_file_name
    ftp.download_file(ftp_file_path, dst_file_path, file_name_today)

    # try:
    #     ftp.download_file(ftp_file_path, dst_file_path, file_name_today)
    # except:
    #     print('异常')
