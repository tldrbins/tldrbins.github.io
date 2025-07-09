---
title: "Network Discovery"
date: 2025-4-2
tags: ["Port Scanning", "Arp", "Iptables", "Tcpdump", "Packet Sniffing", "Reconnaissance", "Port", "Network", "Discovery", "Ping"]
---

#### Test Connectivity

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

```console
# With Active Directory Module Installed
Get-ADComputer -Filter * | ForEach-Object { $_ | Select-Object Name, @{Name='IPAddress';Expression={(Test-Connection -ComputerName $_.Name -Count 1).IPV4Address}}}
```

{{< /tabcontent >}}

---

#### Test Reverse Connectivity

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
sudo tcpdump -ni tun0 icmp
```

{{< /tabcontent >}}

---

#### Sniff Network Traffic

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
# Sniff on a port
sudo tcpdump -i lo -nnXs 0 'port <TARGET_PORT>'
```

```console
# Sniff HTTPS traffic
sudo ./mitmdump -p 443 --mode reverse:https://<DOMAIN> --ssl-insecure --set flow_detail=3
```

<small>*Ref: [mitmproxy](https://mitmproxy.org/)*</small>

{{< /tabcontent >}}

---

#### Quick Subnet Scan

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

---

#### Quick Port Scan

{{< tab set5 tab1 >}}Linux{{< /tab >}}
{{< tab set5 tab2 >}}Windows{{< /tab >}}
{{< tab set5 tab3 >}}Sliver{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
for i in $(seq 1 65535); do (nc -zvn <TARGET> ${i} 2>&1 | grep -v "Connection refused" &); done
```

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

```console
# This is SLOW
1..65535 | % {echo ((new-object Net.Sockets.TcpClient).Connect('<TARGET>',$_)) "Port $_ is open!"} 2>$null
```

{{< /tabcontent >}}
{{< tabcontent set5 tab3 >}}

```console
# This is QUICK
ascan <SUBNET>.1-254
```

```console {class="sample-code"}
sliver (session) > ascan 192.168.99.1-254

[*] Successfully executed ascan
[*] Got output:
 _____     _   _____             
|  _  |___| |_|   __|___ ___ ___                                                                                                                                                                                    
|     |  _|  _|__   |  _| .'|   |                                                                                                                                                                                   
|__|__|_| |_| |_____|___|__,|_|_|                                                                                                                                                                                   
ArtScan by @art3x         ver 1.1                                                                                                                                                                                   
[.] Scanning IP(s): 192.168.99.1-254
[.] PORT(s): TOP 120                                                                                                                                                                                                
[.] Threads: 20   Rechecks: 0   Timeout: 100                                                                                                                                                                        
192.168.99.1:445 is open.                                                                                                                                                                                           
192.168.99.1:139 is open.
192.168.99.1:464 is open.
192.168.99.1:88 is open.
192.168.99.1:389 is open.
192.168.99.1:80 is open. code:301 len:169 title:301 Moved Permanently
192.168.99.1:135 is open.
192.168.99.1:53 is open.
192.168.99.1:593 is open. ncacn_http/1.0
192.168.99.1:2179 is open.
192.168.99.1:3268 is open.
192.168.99.1:5985 is open. code:404 len:315 title:
192.168.99.1:47001 is open. code:404 len:315 title:
192.168.99.1:9389 is open.
------------------
192.168.99.2:445 is open.
192.168.99.2:139 is open.
192.168.99.2:135 is open.
192.168.99.2:5985 is open. code:404 len:315 title:
192.168.99.2:47001 is open. code:404 len:315 title:
------------------
192.168.99.12:22 is open. SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.7
------------------

Summary:
192.168.99.1: 53,80,88,135,139,389,445,464,593,2179,3268,5985,9389,47001
192.168.99.2: 135,139,445,5985,47001
192.168.99.12: 22

Scan Duration: 8.88 s
```

<small>*Ref: [ascan](https://github.com/art3x/ascan)*</small>

{{< /tabcontent >}}

---

#### Check ARP Table

{{< tab set6 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set6 tab1 >}}

```console
arp -na
```

```console
cat /proc/net/arp
```

{{< /tabcontent >}}

---

#### Check IP

{{< tab set7 tab1 >}}Linux{{< /tab >}}
{{< tab set7 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set7 tab1 >}}

```console
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
ipconfig /all
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

---

#### Check Network Connections

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
---[SNIP]--- 
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
---[SNIP]---                  
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                   
udp        0      0 0.0.0.0:68              0.0.0.0:*                           - 
---[SNIP]--- 
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
# List listening ports
netstat -ano | findstr LISTENING
```

```console
# List TCP listening ports and processes
Get-NetTCPConnection -State Listen | Select-Object -Property *,@{'Name' = 'ProcessName';'Expression'={(Get-Process -Id $_.OwningProcess).Name}} | Format-Table -Property LocalAddress,LocalPort,OwningProcess,ProcessName
```

{{< /tabcontent >}}
