# Gather system information and output as JSON
$osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
$csInfo = Get-CimInstance -ClassName Win32_ComputerSystem
$biosInfo = Get-CimInstance -ClassName Win32_BIOS
$cpuInfo = Get-CimInstance -ClassName Win32_Processor
$diskInfo = Get-CimInstance -ClassName Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 }

# Prepare the object to output
$systemInfo = @{
    OSName = $osInfo.Caption
    OSVersion = $osInfo.Version
    Architecture = $osInfo.OSArchitecture
    Manufacturer = $csInfo.Manufacturer
    Model = $csInfo.Model
    TotalVisibleMemorySize = [math]::Round($csInfo.TotalPhysicalMemory / 1GB)
    FreePhysicalMemory = [math]::Round($osInfo.FreePhysicalMemory / 1MB)
    CPUModel = $cpuInfo.Name
    CPUSpeedMHz = $cpuInfo.MaxClockSpeed
    BIOSVersion = $biosInfo.SMBIOSBIOSVersion
    SerialNumber = $biosInfo.SerialNumber
    DiskCapacityGB = [math]::Round($diskInfo.Size / 1GB)
    DiskFreeSpaceGB = [math]::Round($diskInfo.FreeSpace / 1GB)
    SystemUptime = [math]::Round($osInfo.LocalDateTime - $osInfo.LastBootUpTime, 0).TotalMinutes
}

# Convert to JSON and output
$systemInfo | ConvertTo-Json
