---
title: "Firewall (Windows)"
date: 2024-7-10
tags: ["firewall", "inbound", "outbound", "network", "Windows", "cmd", "powershell"]
---

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Firewall Rules

<div>

```console
# cmd
cmd /c "netsh advfirewall firewall show rule name=all|findstr Name:"
```

```console
# powershell
Get-NetFirewallProfile
```

```console
# Check outbound rules
Get-NetFirewallRule -Direction Outbound -Enabled True
```

```console
# Pretty Print
powershell -c "Get-NetFirewallRule -Direction Outbound -Enabled True -Action Block | Format-Table -Property DisplayName,@{Name='Protocol';Expression={($PSItem | Get-NetFirewallPortFilter).Protocol}},@{Name='LocalPort';Expression={($PSItem | Get-NetFirewallPortFilter).LocalPort}},@{Name='RemotePort';Expression={($PSItem | Get-NetFirewallPortFilter).RemotePort}},@{Name='RemoteAddress';Expression={($PSItem | Get-NetFirewallAddressFilter).RemoteAddress}}, Enabled, Profile,Direction,Action"
```

</div>

### Add Inbound Rules

<div>

```console
# Allow all inbound traffic from local subnet
New-NetFirewallRule -DisplayName "Allow All" -Direction Inbound -Enabled True -RemoteAddress LocalSubnet -Action Allow -Protocol TCP -Profile ANY
```

</div>

{{< /tabcontent >}}

<br>
