---
title: "Defender (Windows)"
date: 2024-7-16
tags: ["defender", "av", "antivirus", "Windows", "powershell", "bypass"]
---

---
### Disable defender

```powershell
# Disable realtime monitoring
Set-MpPreference -DisableRealtimeMonitoring $true
```

```powershell
# Completely disable defender
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender" -Name DisableAntiSpyware -Value 1 -PropertyType DWORD -Force
```

<br>
