---
title: "Network Discovery"
date: 2024-6-26
tags: ["Port Scanning", "Arp", "Iptables", "Tcpdump", "Packet Sniffing", "Reconnaissance", "Port", "Network", "Discovery", "Ping"]
---

### Test connectivity

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Default infinite pings
ping -c3 <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Default 5 pings
ping <TARGET>
```

```console
# Check specific port
Test-NetConnection <TARGET> -Port <TARGET_PORT>
```

{{< /tabcontent >}}

### Test reverse connectivity

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
sudo tcpdump -ni tun0 icmp
```

{{< /tabcontent >}}

### Sniff network traffic

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
# For example: on port 389
sudo tcpdump -i lo -nnXs 0 'port <TARGET_PORT>'
```

```console
# Sniff HTTPS traffic
sudo ./mitmdump -p 443 --mode reverse:https://<DOMAIN> --ssl-insecure --set flow_detail=3
```

<small>*Ref: [mitmproxy](https://mitmproxy.org/)*</small>

{{< /tabcontent >}}

### Use ping to scan subnet

{{< tab set4 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
for i in $(seq 1 254); do (ping -c 1 10.100.10.${i} | grep "bytes from" &); done;
```

{{< /tabcontent >}}

### Use nc to scan ports

{{< tab set5 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
for i in $(seq 1 65535); do (nc -zvn 127.0.0.1 ${i} 2>&1 | grep -v "Connection refused" &); done
```

{{< /tabcontent >}}

### Check arp table

{{< tab set6 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set6 tab1 >}}

```console
arp -na
```

```console
cat /proc/net/arp
```

{{< /tabcontent >}}

### Check IP

{{< tab set7 tab1 active >}}Linux{{< /tab >}}
{{< tab set7 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set7 tab1 >}}

```console
# Linux
ifconfig
```

```console
ip addr
```

```console
cat /proc/net/fib_trie
```

{{< /tabcontent >}}
{{< tabcontent set7 tab2 >}}

```console
ipconfig
```

{{< /tabcontent >}}

### Check network connections

{{< tab set8 tab1 active >}}Linux{{< /tab >}}
{{< tab set8 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set8 tab1 >}}

```console
# TCP
netstat -plant
```

```console
# UDP
netstat -plunt
```

```console
# If netstat not present
cat /proc/net/tcp | grep '00000000:0000 0A'
```

```console
ss -tnl
```

{{< /tabcontent >}}
{{< tabcontent set8 tab2 >}}

```console
# List only listening ports
netstat -ano | findstr LISTENING
```

```console
# List tcp listening ports and processes
Get-NetTCPConnection -State Listen | Select-Object -Property *,@{'Name' = 'ProcessName';'Expression'={(Get-Process -Id $_.OwningProcess).Name}} | Format-Table -Property LocalAddress,LocalPort,OwningProcess,ProcessName
```

{{< /tabcontent >}}
