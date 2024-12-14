---
title: "Network Discovery"
date: 2024-6-26
tags: ["Port Scanning", "Arp", "Iptables", "Tcpdump", "Packet Sniffing", "Reconnaissance", "Port", "Network", "Discovery", "Ping"]
---

### Test connectivity

{{< tab set1 tab1 >}}Linux{{< /tab >}}
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

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
sudo tcpdump -ni tun0 icmp
```

{{< /tabcontent >}}

### Sniff network traffic

{{< tab set3 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
# Sniff on network adapter
sudo tcpdump -i eth0 -w packets.pcap
```

```console {class="sample-code"}
root@NIX01:/dev/shm# sudo tcpdump -i eth0 -w packets.pcap
tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
^C124 packets captured          <----- Send Ctrl+C after some time
133 packets received by filter
0 packets dropped by kernel
```

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

{{< tab set4 tab1 >}}Linux{{< /tab >}}
{{< tab set4 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
# 255.255.255.0 or /24
for i in $(seq 1 254); do (ping -c 1 <SUBNET>.${i} | grep "bytes from" &); done;
```

```console
# 255.255.0.0 or /16
for i in $(seq 1 254); do for j in $(seq 1 254); do (ping -c 1 <SUBNET>.${i}.${j} | grep "bytes from" &); done; done;
```

{{< /tabcontent >}}
{{< tabcontent set4 tab2 >}}

```console
1..254 | % { $ip="<SUBNET>.$_"; if (Test-Connection $ip -Count 1 -Quiet) { "$ip is alive" } }
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Administrator\Documents> 1..254 | % { $ip="172.16.1.$_"; if (Test-Connection $ip -Count 1 -Quiet) { "$ip is alive" } }
172.16.2.5 is alive
```

{{< /tabcontent >}}

### Quick scan ports

{{< tab set5 tab1 >}}Linux{{< /tab >}}
{{< tab set5 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
for i in $(seq 1 65535); do (nc -zvn <TARGET> ${i} 2>&1 | grep -v "Connection refused" &); done
```

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

```console
1..65535 | % {echo ((new-object Net.Sockets.TcpClient).Connect('<TARGET>',$_)) "Port $_ is open!"} 2>$null
```

{{< /tabcontent >}}

### Check arp table

{{< tab set6 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set6 tab1 >}}

```console
arp -na
```

```console
cat /proc/net/arp
```

{{< /tabcontent >}}

### Check IP

{{< tab set7 tab1 >}}Linux{{< /tab >}}
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
# Get local IP
ipconfig
```

```console
# Check DNS
ipconfig /displaydns
```

```console
# Get DC IP
nltest /dsgetdc:<DOMAIN> /force
```

```console
# Get AD-Computers IP
Get-ADComputer -Filter * -Properties IPv4Address | select name,IPV4Address
```

{{< /tabcontent >}}

### Check network connections

{{< tab set8 tab1 >}}Linux{{< /tab >}}
{{< tab set8 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set8 tab1 >}}

```console
# TCP
netstat -plant
```

```console {class="sample-code"}
$ netstat -plant
(Not all processes could be identified, non-owned process info                                          
 will not be shown, you would have to be root to see it all.)                                           
Active Internet connections (servers and established)                                                   
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name        
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                       
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -                       
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -                       
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -
...[SNIP]... 
```

```console
# UDP
netstat -plunt
```

```console {class="sample-code"}
$ netstat -plunt
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
...[SNIP]...                  
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                   
udp        0      0 0.0.0.0:68              0.0.0.0:*                           - 
...[SNIP]... 
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
