---
title: "Monitor Process (Windows)"
date: 2024-10-5
tags: ["Monitor", "Process", "Background Tasks", "Windows"]
---

{{< tab set1 tab1 >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Template

```console
# Define the process name
$processName = "<PROCESS>"

# Define the interval in seconds between checks (e.g., 5 seconds)
$interval = 5

# Start an infinite loop
while ($true) {
    # Check if the process is running
    $process = Get-Process -Name $processName -ErrorAction SilentlyContinue

    if ($process) {
        # If the process is found, perform your action
        Write-Host "<PROCESS> process is running."
        
        # Perform your custom action here
        # Example: Write-Host "Performing action..."

    } else {
        # If the process is not found, output a message
        Write-Host "<PROCESS> process is not running."
    }

    # Wait for the defined interval before checking again
    Start-Sleep -Seconds $interval
}
```

#### Execution

```bash
# Bypass script execution policy
powerShell.exe -ExecutionPolicy UnRestricted -File monitor.ps1
```

{{< /tabcontent >}}

