// localhost_info.js
const os = require('os');

function getLocalhostSystemInfo() {
  return {
    homeFolder: os.homedir(),
    type: os.type(),
    release: os.release(),
    platform: os.platform(),
    cpuArchitecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    localTime: new Date().toLocaleString(),
    uptime: os.uptime(),
    currentFolder: process.cwd()
  };
}

module.exports = getLocalhostSystemInfo;
