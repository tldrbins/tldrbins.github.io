---
title: "Nmap"
date: 2024-6-26
tags: ["nmap", "port", "network", "discovery", "reconnaissance", "scan", "enum"]
---

---
### Nmap Port Scan

#### TCP Scan

```bash
target=10.10.11.10
nmap -p- --min-rate 10000 -oA ./nmap-alltcp $target
ports=$(cat nmap-alltcp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
nmap -p $ports -sCV -oA ./nmap-tcpscripts $target
```

#### UDP Scan (common ports)

```bash
target=10.10.11.10
nmap -sU --min-rate 10000 -oA ./nmap-udp $target
ports=$(cat nmap-udp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
nmap -p $ports -sU -sCV -oA ./nmap-udpscripts $target
```

<br>

---

### Scan with nmap scripts

#### Update scripts DB

```bash
nmap --script-updatedb
```

#### Search scripts

```bash
nmap --script-help ftp*
```

#### Scan with scripts

```bash
nmap --script=ftp-anon -sV -sC -p 21 10.10.11.10
```

<br>