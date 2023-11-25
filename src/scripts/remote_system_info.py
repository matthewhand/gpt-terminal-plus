#/usr/bin/python3
import os, platform
import psutil
import datetime
import json

boot_time_timestamp = psutil.boot_time()
bt = datetime.datetime.fromtimestamp(boot_time_timestamp)
uptime = datetime.datetime.now() - bt
uptime_seconds = uptime.total_seconds()
data = {
  "homeFolder": os.path.expanduser("~"),
  "type": os.name,
  "release": platform.release(),
  "platform": platform.system(),
  "pythonVersion": platform.python_version(),
  "cpuArchitecture": platform.machine(),
  "totalMemory": os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_PHYS_PAGES"),
  "freeMemory": os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_AVPHYS_PAGES"),
  "uptime": uptime_seconds,
  "currentFolder": os.getcwd()
}
json_response = json.dumps(data)
print(json_response)
