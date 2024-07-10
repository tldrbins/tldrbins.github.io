---
title: "Firewall (Windows)"
date: 2024-7-10
tags: ["firewall", "inbound", "outbound", "network", "Windows", "cmd", "powershell"]
---

---
### Check Firewall Rules

```powershell
# cmd
cmd /c "netsh advfirewall firewall show rule name=all|findstr Name:"
```

```powershell
# powershell
Get-NetFirewallProfile
```

```powershell
# Check outbound rules
Get-NetFirewallRule -Direction Outbound -Enabled True
```

<br>
