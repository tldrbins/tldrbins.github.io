---
title: "Firewall (Windows)"
date: 2024-7-10
tags: ["Firewall", "Inbound", "Outbound", "Network", "Windows"]
---

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Firewall Rules

```console
# cmd
cmd /c "netsh advfirewall firewall show rule name=all|findstr Name:"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> cmd /c "netsh advfirewall firewall show rule name=all|findstr Name:"
Rule Name:                            World Wide Web Services (HTTPS Traffic-In)
Rule Name:                            World Wide Web Services (HTTP Traffic-In)
Rule Name:                            Shell Input Application
...[SNIP]...
Rule Name:                            Virtual Machine Monitoring (Echo Request - ICMPv6-In)
Rule Name:                            Virtual Machine Monitoring (Echo Request - ICMPv4-In)
Rule Name:                            Virtual Machine Monitoring (DCOM-In)
```

```console
# powershell
Get-NetFirewallProfile
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Get-NetFirewallProfile


Name                            : Domain
Enabled                         : False
DefaultInboundAction            : NotConfigured
DefaultOutboundAction           : NotConfigured
AllowInboundRules               : NotConfigured
AllowLocalFirewallRules         : NotConfigured
AllowLocalIPsecRules            : NotConfigured
AllowUserApps                   : NotConfigured
AllowUserPorts                  : NotConfigured
AllowUnicastResponseToMulticast : NotConfigured
NotifyOnListen                  : False
EnableStealthModeForIPsec       : NotConfigured
LogFileName                     : %systemroot%\system32\LogFiles\Firewall\pfirewall.log
LogMaxSizeKilobytes             : 4096
LogAllowed                      : False
LogBlocked                      : False
LogIgnored                      : NotConfigured
DisabledInterfaceAliases        : {NotConfigured}

Name                            : Private
Enabled                         : False
DefaultInboundAction            : NotConfigured
DefaultOutboundAction           : NotConfigured
AllowInboundRules               : NotConfigured
AllowLocalFirewallRules         : NotConfigured
AllowLocalIPsecRules            : NotConfigured
AllowUserApps                   : NotConfigured
AllowUserPorts                  : NotConfigured
AllowUnicastResponseToMulticast : NotConfigured
NotifyOnListen                  : False
EnableStealthModeForIPsec       : NotConfigured
LogFileName                     : %systemroot%\system32\LogFiles\Firewall\pfirewall.log
LogMaxSizeKilobytes             : 4096
LogAllowed                      : False
LogBlocked                      : False
LogIgnored                      : NotConfigured
DisabledInterfaceAliases        : {NotConfigured}

Name                            : Public
Enabled                         : False
DefaultInboundAction            : NotConfigured
DefaultOutboundAction           : NotConfigured
AllowInboundRules               : NotConfigured
AllowLocalFirewallRules         : NotConfigured
AllowLocalIPsecRules            : NotConfigured
AllowUserApps                   : NotConfigured
AllowUserPorts                  : NotConfigured
AllowUnicastResponseToMulticast : NotConfigured
NotifyOnListen                  : False
EnableStealthModeForIPsec       : NotConfigured
LogFileName                     : %systemroot%\system32\LogFiles\Firewall\pfirewall.log
LogMaxSizeKilobytes             : 4096
LogAllowed                      : False
LogBlocked                      : False
LogIgnored                      : NotConfigured
DisabledInterfaceAliases        : {NotConfigured}
```

```console
# Check outbound rules
Get-NetFirewallRule -Direction Outbound -Enabled True
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Get-NetFirewallRule -Direction Outbound -Enabled True

Name                  : Microsoft-Windows-Unified-Telemetry-Client
DisplayName           : Connected User Experiences and Telemetry
Description           : Unified Telemetry Client Outbound Traffic
DisplayGroup          : DiagTrack
Group                 : DiagTrack
Enabled               : True
Profile               : Any
Platform              : {}
Direction             : Outbound
Action                : Allow
EdgeTraversalPolicy   : Block
LooseSourceMapping    : False
LocalOnlyMapping      : False
Owner                 :
PrimaryStatus         : OK
Status                : The rule was parsed successfully from the store. (65536)
EnforcementStatus     : NotApplicable
PolicyStoreSource     : PersistentStore
PolicyStoreSourceType : Local

...[SNIP]...

Name                  : {5ADD1B2F-E298-4E9D-AEB5-C8C4B224D74A}
DisplayName           : Shell Input Application
Description           : Shell Input Application
DisplayGroup          : Shell Input Application
Group                 : Shell Input Application
Enabled               : True
Profile               : Domain, Private, Public
Platform              : {6.2+}
Direction             : Outbound
Action                : Allow
EdgeTraversalPolicy   : Block
LooseSourceMapping    : False
LocalOnlyMapping      : False
Owner                 : S-1-5-21-4088429403-1159899800-2753317549-1106
PrimaryStatus         : OK
Status                : The rule was parsed successfully from the store. (65536)
EnforcementStatus     : NotApplicable
PolicyStoreSource     : PersistentStore
PolicyStoreSourceType : Local
```

```console
# Pretty print
powershell -c "Get-NetFirewallRule -Direction Outbound -Enabled True -Action Block | Format-Table -Property DisplayName,@{Name='Protocol';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).Protocol}},@{Name='LocalPort';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).LocalPort}},@{Name='RemotePort';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).RemotePort}},@{Name='RemoteAddress';Expression={(Get-NetFirewallAddressFilter -AssociatedNetFirewallRule $PSItem).RemoteAddress}},Enabled,Profile,Direction,Action"
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> powershell -c "Get-NetFirewallRule -Direction Outbound -Enabled True -Action Block | Format-Table -Property DisplayName,@{Name='Protocol';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).Protocol}},@{Name='LocalPort';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).LocalPort}},@{Name='RemotePort';Expression={(Get-NetFirewallPortFilter -AssociatedNetFirewallRule $PSItem).RemotePort}},@{Name='RemoteAddress';Expression={(Get-NetFirewallAddressFilter -AssociatedNetFirewallRule $PSItem).RemoteAddress}},Enabled,Profile,Direction,Action"


DisplayName     Protocol LocalPort RemotePort RemoteAddress Enabled Profile Direction Action
-----------     -------- --------- ---------- ------------- ------- ------- --------- ------
BlockOutboundDC                                                True     Any  Outbound  Block
```

### Add Inbound Rules

```console
# Allow all inbound traffic from local subnet
New-NetFirewallRule -DisplayName "Allow All" -Direction Inbound -Enabled True -RemoteAddress LocalSubnet -Action Allow -Protocol TCP -Profile ANY
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> New-NetFirewallRule -DisplayName "Allow All" -Direction Inbound -Enabled True -RemoteAddress LocalSubnet -Action Allow -Protocol TCP -Profile ANY


Name                  : {40819844-ba45-451b-be9c-f9878e2e6011}
DisplayName           : Allow All
Description           :
DisplayGroup          :
Group                 :
Enabled               : True
Profile               : Any
Platform              : {}
Direction             : Inbound
Action                : Allow
EdgeTraversalPolicy   : Block
LooseSourceMapping    : False
LocalOnlyMapping      : False
Owner                 :
PrimaryStatus         : OK
Status                : The rule was parsed successfully from the store. (65536)
EnforcementStatus     : NotApplicable
PolicyStoreSource     : PersistentStore
PolicyStoreSourceType : Local
```

### Disable Firewall

```console
Set-NetFirewallProfile -Profile Domain, Public, Private -Enabled False
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Set-NetFirewallProfile -Profile Domain, Public, Private -Enabled False
```

```console
# Check
Get-NetFirewallProfile | Format-Table Name, Enabled
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\maria> Get-NetFirewallProfile | Format-Table Name, Enabled

Name    Enabled
----    -------
Domain    False
Private   False
Public    False
```

{{< /tabcontent >}}
