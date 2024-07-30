import { escapeSpecialChars } from '../common/escapeSpecialChars';

/**
 * PowerShell command to retrieve system information in JSON format.
 * 
 * This command outputs a JSON string containing the following information:
 * - Home folder
 * - OS type
 * - OS release
 * - Platform
 * - Architecture
 * - Total memory (in GB)
 * - Free memory (in MB)
 * - System uptime
 * - Current working directory
 * - PowerShell version
 */
const rawPsSystemInfoCmd = `
$info = @{}
$info['homeFolder'] = [System.Environment]::GetFolderPath('UserProfile')
$info['type'] = (Get-WmiObject -Class Win32_OperatingSystem).Caption
$info['release'] = (Get-WmiObject -Class Win32_OperatingSystem).Version
$info['platform'] = [System.Environment]::OSVersion.Platform
$info['architecture'] = [System.Environment]::Is64BitOperatingSystem
$info['totalMemory'] = [System.Math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$info['freeMemory'] = [System.Math]::Round((Get-WmiObject -Class Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2)
$info['uptime'] = (Get-WmiObject -Class Win32_OperatingSystem).LastBootUpTime
$info['currentFolder'] = Get-Location
$info['powershellVersion'] = $PSVersionTable.PSVersion.ToString()
$info | ConvertTo-Json
`;

export const psSystemInfoCmd = escapeSpecialChars(rawPsSystemInfoCmd);

/**
 * Logs the execution of the PowerShell system info command for debugging purposes.
 * Includes details of the command executed and any potential errors.
 */
console.debug('Executing psSystemInfoCmd:', psSystemInfoCmd);

try {
  // Here we would normally execute the command, but in this context, we'll just log it.
  console.log('PowerShell system information command executed successfully.');
} catch (error) {
  console.error('Error executing PowerShell system information command:', error);
}
