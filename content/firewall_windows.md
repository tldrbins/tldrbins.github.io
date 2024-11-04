---
title: "Firewall (Windows)"
date: 2024-7-10
tags: ["Firewall", "Inbound", "Outbound", "Network", "Windows"]
---

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Firewall Rules

{{< tab set1-1 tab1 active >}}powershell{{< /tab >}}{{< tab set1-1 tab2 >}}cmd{{< /tab >}}
{{< tabcontent set1-1 tab1 >}}

```console
# Check profiles
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

...[SNIP]...
```

```console
# Check inbound rules
Get-NetFirewallRule -Direction InBound -Enabled True
```

```console {class="sample-code"}
PS C:\programdata> Get-NetFirewallRule -Direction Inbound -Enabled True

Name                  : DeliveryOptimization-TCP-In
DisplayName           : Delivery Optimization (TCP-In)
Description           : Inbound rule to allow Delivery Optimization to connect to remote endpoints
DisplayGroup          : Delivery Optimization
Group                 : @%systemroot%\system32\dosvc.dll,-100
Enabled               : True
Profile               : Any
Platform              : {}
Direction             : Inbound
Action                : Allow
EdgeTraversalPolicy   : Allow
LooseSourceMapping    : False
LocalOnlyMapping      : False
Owner                 : 
PrimaryStatus         : OK
Status                : The rule was parsed successfully from the store. (65536)
EnforcementStatus     : NotApplicable
PolicyStoreSource     : PersistentStore
PolicyStoreSourceType : Local

...[SNIP]...
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
```

{{< /tabcontent >}}
{{< tabcontent set1-1 tab2 >}}

```console
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

{{< /tabcontent >}}

### Add Inbound Rules

{{< tab set1-2 tab1 active >}}powershell{{< /tab >}}{{< tab set1-2 tab2 >}}cmd{{< /tab >}}
{{< tabcontent set1-2 tab1 >}}

```console
# Allow all inbound traffic from local subnet
New-NetFirewallRule -DisplayName "Allow All From LocalSubnet" -Direction Inbound -RemoteAddress LocalSubnet -Protocol TCP -Action Allow -Enabled True -Profile ANY
```

```console {class="sample-code"}
PS C:\programdata> New-NetFirewallRule -DisplayName "Allow All From LocalSubnet" -Direction Inbound -RemoteAddress LocalSubnet -Protocol TCP -Action Allow -Enabled True -Profile ANY

Name                  : {b67cb3e9-4a15-422a-ad46-49742bf98d51}
DisplayName           : Allow All From LocalSubnet
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

{{< /tabcontent >}}
{{< tabcontent set1-2 tab2 >}}

````console
netsh advfirewall firewall add rule name="Open Port <PORT> IN" dir=in action=allow protocol=TCP localport=<PORT>
````

{{< /tabcontent >}}

### Add Outbound Rules

{{< tab set1-3 tab1 active >}}powershell{{< /tab >}}{{< tab set1-3 tab2 >}}cmd{{< /tab >}}
{{< tabcontent set1-3 tab1 >}}

```console
New-NetFirewallRule -DisplayName "Allow Port <PORT> Outbound" -Direction Outbound -LocalPort <PORT> -Protocol TCP -Action Allow -Enabled True -Profile ANY
```

```console {class="sample-code"}
PS C:\programdata> New-NetFirewallRule -DisplayName "Allow Port 8000 Outbound" -Direction Outbound -LocalPort 8000 -Protocol TCP -Action Allow -Enabled True -Profile ANY

Name                  : {bb40ce74-5196-4435-92fe-7ecc08fbf13f}
DisplayName           : Allow Port 8000 Outbound
Description           : 
DisplayGroup          : 
Group                 : 
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
```

{{< /tabcontent >}}
{{< tabcontent set1-3 tab2 >}}

````console
netsh advfirewall firewall add rule name="Open Port <PORT> OUT" dir=out action=allow protocol=TCP localport=<PORT>
````

{{< /tabcontent >}}


### Disable Firewall

{{< tab set1-4 tab1 active >}}powershell{{< /tab >}}{{< tab set1-4 tab2 >}}cmd{{< /tab >}}
{{< tabcontent set1-4 tab1 >}}

```console
# Disable all firewall profiles
Set-NetFirewallProfile -Profile Domain, Public, Private -Enabled False
```

```console {class="sample-code"}
PS C:\programdata> Set-NetFirewallProfile -Profile Domain, Public, Private -Enabled False
```

```console
# Check
Get-NetFirewallProfile | Format-Table Name, Enabled
```

```console {class="sample-code"}
PS C:\programdata> Get-NetFirewallProfile | Format-Table Name, Enabled

Name    Enabled
----    -------
Domain    False
Private   False
Public    False
```

{{< /tabcontent >}}
{{< tabcontent set1-4 tab2 >}}

```console
netsh advfirewall set allprofiles state off
```

```console {class="sample-code"}
C:\>netsh advfirewall set allprofiles state off
Ok.
```

{{< /tabcontent >}}
{{< /tabcontent >}}
