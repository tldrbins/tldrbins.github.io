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
for i in $(seq 1 65535); do nc -zvn 127.0.0.1 ${i}; done
```

### Check ARP

```bash
arp -na
cat /proc/net/arp
```

### Check IP

```bash
# Linux
ifconfig

# Windows
ipconfig

ip addr
cat /proc/net/fib_trie
```

### Check Network Connections

```bash
# TCP
netstat -plant

# UDP
netstat -plunt

# Windows
netstat -ano
```

<br>