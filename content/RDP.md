---
title: "RDP"
date: 2025-7-25
tags: ["RDP", "Remote Desktop", "Windows", "xfreerdp"]
---

### Enable RDP

```console
# Enable Terminal Server
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name 'fDenyTSConnections' -Value 0
```

```console
# Allow Inbound Traffic
netsh advfirewall firewall add rule name="Open Port 3389 IN" dir=in action=allow protocol=TCP localport=3389
```

{{< tab set1 tab1 >}}xfreerdp{{< /tab >}}
{{< tab set1 tab2 >}}remmina{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### freerdp

```console
# Password
xfreerdp /u:'<USER>' /p:'<PASSWORD>' /d:<DOMAIN> /v:<TARGET> /smart-sizing:1920x1080
```

```console
# NTLM
xfreerdp /u:'<USER>' /pth:'<HASH>' /d:<DOMAIN> /v:<TARGET> /smart-sizing:1920x1080
```

#### xfreerdp3

```console
# Anonymous
xfreerdp3 /v:<TARGET> /smart-sizing:1920x1080 /clipboard:direction-to:all /sec:nla:off
```

```console
# Password
xfreerdp3 /u:'<USER>' /p:'<PASSWORD>' /d:<DOMAIN> /v:<TARGET> /smart-sizing:1920x1080 /clipboard:direction-to:all /sec:nla:off
```

```console
# NTLM
xfreerdp3 /u:'<USER>' /pth:<HASH> /d:<DOMAIN> /v:<TARGET> /smart-sizing:1920x1080 /clipboard:direction-to:all /sec:nla:off
```

```console
# Local auth
xfreerdp3 /u:'<USER>' /p:'<PASSWORD>' /v:<TARGET> /smart-sizing:1920x1080 /clipboard:direction-to:all /sec:tls:off
```

```console
# Socks5
xfreerdp3 /u:'<USER>' /p:'<PASSWORD>' /d:<DOMAIN> /v:<TARGET> /smart-sizing:1920x1080 /clipboard:direction-to:all /sec:nla:off /proxy:socks5://127.0.0.1:1080
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
remmina
```

#### Fix ERRCONNECT_TLS_CONNECT_FAILED

```console
Advanced -> TLS Security Level -> 0
```

{{< /tabcontent >}}