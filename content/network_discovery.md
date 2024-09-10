---
title: "Network Discovery"
date: 2024-6-26
tags: ["port", "network", "discovery", "reconnaissance", "ping", "tcpdump", "Windows", "Linux"]
---

---
### Test connectivity

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Default infinite pings
ping -c3 10.10.11.10
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```powershell
# Default 5 pings
ping 10.10.11.10
```

```powershell
# Check specific port
Test-NetConnection <TARGET> -Port 5985
```

</div>

{{< /tabcontent >}}

### Test reverse connectivity

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
sudo tcpdump -ni tun0 icmp
```

</div>

{{< /tabcontent >}}

### Sniff network traffic

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```bash
# For example: on port 389
sudo tcpdump -i lo -nnXs 0 'port 389'
```

```bash
# Sniff HTTPS traffic
sudo ./mitmdump -p 443 --mode reverse:https://example.com --ssl-insecure --set flow_detail=3
```

</div>

<small>*Ref: [mitmproxy](https://mitmproxy.org/)*</small>

{{< /tabcontent >}}

### Use ping to scan subnet

{{< tab set4 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```bash
for i in $(seq 1 254); do (ping -c 1 10.100.10.${i} | grep "bytes from" &); done;
```

</div>

{{< /tabcontent >}}

### Use nc to scan ports

{{< tab set5 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set5 tab1 >}}

<div>

```bash
for i in $(seq 1 65535); do (nc -zvn 127.0.0.1 ${i} 2>&1 | grep -v "Connection refused" &); done
```

</div>

{{< /tabcontent >}}

### Check arp table

{{< tab set6 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set6 tab1 >}}

<div>

```bash
arp -na
```

```bash
cat /proc/net/arp
```

</div>

{{< /tabcontent >}}

### Check IP

{{< tab set7 tab1 active >}}Linux{{< /tab >}}
{{< tab set7 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set7 tab1 >}}

<div>

```bash
# Linux
ifconfig
```

```bash
ip addr
```

```bash
cat /proc/net/fib_trie
```

</div>

{{< /tabcontent >}}
{{< tabcontent set7 tab2 >}}

<div>

```bash
ipconfig
```

</div>

{{< /tabcontent >}}

### Check network connections

{{< tab set8 tab1 active >}}Linux{{< /tab >}}
{{< tab set8 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set8 tab1 >}}

<div>

```bash
# TCP
netstat -plant
```

```bash
# UDP
netstat -plunt
```

```bash
# If netstat not present
cat /proc/net/tcp | grep '00000000:0000 0A'
```

```bash
ss -tnl
```

</div>

{{< /tabcontent >}}
{{< tabcontent set8 tab2 >}}

<div>

```powershell
# List only listening ports
netstat -ano | findstr LISTENING
```

```powershell
# List tcp listening ports and processes
Get-NetTCPConnection -State Listen | Select-Object -Property *,@{'Name' = 'ProcessName';'Expression'={(Get-Process -Id $_.OwningProcess).Name}} | Format-Table -Property LocalAddress,LocalPort,OwningProcess,ProcessName
```

</div>

{{< /tabcontent >}}

<br>