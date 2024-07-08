---
title: "Network Discovery"
date: 2024-6-26
tags: ["port", "network", "discovery", "reconnaissance", "ping", "tcpdump"]
---

---
### Test Connectivity

```bash
ping -c3 10.10.11.10
```

### Test Reverse Connectivity

```bash
sudo tcpdump -ni tun0 icmp
```

### Use ping to Scan Subnet

```bash
for i in $(seq 1 254); do (ping -c 1 10.100.10.${i} | grep "bytes from" &); done;
```

### Use nc to Scan Ports

```bash
for i in $(seq 1 65535); do (nc -zvn 127.0.0.1 ${i} 2>&1 | grep -v "Connection refused" &); done
```

### Check ARP

```bash
arp -na
```

```bash
cat /proc/net/arp
```

### Check IP

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

```bash
# Windows
ipconfig
```

### Check Network Connections

```bash
# TCP
netstat -plant
```

```bash
# UDP
netstat -plunt
```

```bash
# Windows
netstat -ano
```

<br>