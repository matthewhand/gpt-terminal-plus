export const psSystemInfoCmd = `
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
