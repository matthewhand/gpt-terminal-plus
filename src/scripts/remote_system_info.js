const os = require('os');
const fs = require('fs');
const path = require('path');

// Function to safely get system information
function getInfo() {
  try {
    const uptime = os.uptime();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    const systemInfo = {
      homeFolder: os.homedir(),
      type: os.type(),
      release: os.release(),
      platform: os.platform(),
      architecture: os.arch(),
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      uptime: uptime,
      currentFolder: process.cwd()
    };

    return JSON.stringify(systemInfo, null, 2);
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
}

// Write the information to stdout
console.log(getInfo());

