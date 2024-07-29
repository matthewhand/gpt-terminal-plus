// src/utils/systemInfoUtils.ts
import { SystemInfo } from '../types/SystemInfo';

export function getSystemInfoCommand(): string {
  // Construct the command string to fetch system info
  return `
    uname -mrsn; 
    awk '/MemTotal/ {print $2}' /proc/meminfo; 
    awk '/MemFree/ {print $2}' /proc/meminfo; 
    cat /proc/uptime; 
    echo $HOME
  `;
}

export function parseSystemInfoOutput(output: string): SystemInfo {
  // Parse the output and return a SystemInfo object
  const [unameInfo, totalMemoryKB, freeMemoryKB, uptimeInfo, homeFolder] = output.split('\n');

  const [platform, release, type, nodeName, architecture] = unameInfo.split(' ');

  const totalMemory = parseInt(totalMemoryKB) / 1024;  // Convert KB to MB
  const freeMemory = parseInt(freeMemoryKB) / 1024;  // Convert KB to MB
  const uptime = parseFloat(uptimeInfo.split(' ')[0]) / 60; // Convert seconds to minutes

  return {
    homeFolder: homeFolder.trim(),
    type,
    release,
    platform,
    architecture,
    totalMemory,
    freeMemory,
    uptime,
    currentFolder: '', // currentFolder needs to be set based on the handler's context
  };
}

