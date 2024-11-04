---
title: "RDP"
date: 2024-9-30
tags: ["RDP", "Remote Desktop", "Windows"]
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

```console
xfreerdp /u:'<USER>' /p:'<PASSWORD>' /d:<DOMAIN> /v:<TARGET> /smart-sizing:1400x1080
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