---
title: "Windows Defender"
date: 2024-7-16
tags: ["defender", "av", "antivirus", "Windows", "powershell", "bypass"]
---

### Disable defender

{{< tab set1 tab1 active >}}Powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Disable realtime monitoring
Set-MpPreference -DisableRealtimeMonitoring $true
```

```console
# Completely disable defender
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender" -Name DisableAntiSpyware -Value 1 -PropertyType DWORD -Force
```

{{< /tabcontent >}}
