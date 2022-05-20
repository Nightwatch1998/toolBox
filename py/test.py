import os
import math

# 高德xy转经纬度
def toLngLat(x,y):
    k = 20037508.34 / 180
    lng = x/k
    lat = y/k
    lat = 180 / math.pi * (2 * math.atan(math.exp(lat * math.pi / 180)) - math.pi / 2)
    return [lng,lat]

def fileconvert():
    with open("./1.csv",'w') as f1:
        with open("F:/water_power/grid.csv",'r') as f2:
            for line in f2:
                line = line.split("\n")[0]
                ls = line.split(',')
                wline =  toLngLat(float(ls[2]),float(ls[1]))
                # wline[1] += 112
                wstr = str(wline[1])+','+str(wline[0])+'\n'
                # s.append(x)
                # s.append(y)
                f1.writelines(str(wstr))
fileconvert()