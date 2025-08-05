---
title: "Nmap"
date: 2025-7-17
tags: ["Port Scanning", "Nmap", "Reconnaissance", "Tcp/Ip", "Vulnerability Scanning", "Enumeration", "Port", "Network", "Discovery", "Network Mapping", "Host"]
---

### Host Discovery

#### Ping Scan

```console
nmap -sn <TARGET>
```

```console {class="sample-code"}
$ nmap -sn 192.168.100.1           
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:25 UTC
Nmap scan report for 192.168.100.1
Host is up (0.41s latency).
Nmap done: 1 IP address (1 host up) scanned in 1.35 seconds
```

---

### Scan Techniques (Bypass Network Filtering)

#### TCP SYN to Listed Ports

```console
nmap -sn -PS<PORT_LIST> <TARGET>
```

```console {class="sample-code"}
$ nmap -sn -PS53,80,443 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:25 UTC
Nmap scan report for 192.168.100.1
Host is up (0.40s latency).
Nmap done: 1 IP address (1 host up) scanned in 1.37 seconds
```

#### TCP ACK to Listed Ports

```console
nmap -sn -PA<PORT_LIST> <TARGET>
```

```console {class="sample-code"}
$ nmap -sn -PA53,80,443 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:25 UTC
Nmap scan report for 192.168.100.1
Host is up (0.44s latency).
Nmap done: 1 IP address (1 host up) scanned in 0.89 seconds
```

#### UDP to Listed Ports

```console
nmap -sn -PU<PORT_LIST> <TARGET>
```

```console {class="sample-code"}
$ nmap -sn -PU53,80,443 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:25 UTC
Nmap scan report for 192.168.100.1
Host is up (0.40s latency).
Nmap done: 1 IP address (1 host up) scanned in 0.89 seconds
```

#### Spoofing Source Port

```console
nmap -g <FAKE_PORT> <TARGET>
```

```console {class="sample-code"}
$ nmap -g 80 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:25 UTC
Nmap scan report for 192.168.100.1
Host is up (0.73s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 6.16 seconds
```

#### Spoofing IP Address

```console
nmap -S <FAKE_IP> -e <INTERFACE> -Pn <TARGET>
```

```console {class="sample-code"}
$ nmap -S 192.168.101.1 -e tun0 -Pn 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:43 UTC
Nmap scan report for 192.168.100.1
Host is up (0.056s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 14.78 seconds
```

#### Fragmentation

```console
nmap -f <TARGET>
```

```console {class="sample-code"}
$ nmap -f 192.168.100.1
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 11:42 UTC
Nmap scan report for 192.168.100.1
Host is up (0.053s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 2.24 seconds
```

---

### OS Fingerprinting (Active)

```console
nmap -O --fuzzy <TARGET>
```

```console {class="sample-code"}
$ nmap -O --fuzzy 10.129.234.50                               
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-17 17:00 UTC
Nmap scan report for DC.redelegate.vl (10.129.234.50)
Host is up (0.050s latency).
Not shown: 984 closed tcp ports (reset)
PORT     STATE SERVICE
21/tcp   open  ftp
53/tcp   open  domain
80/tcp   open  http
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
1433/tcp open  ms-sql-s
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
3389/tcp open  ms-wbt-server
5985/tcp open  wsman
Aggressive OS guesses: Microsoft Windows 10 1703 or Windows 11 21H2 (97%), Microsoft Windows Server 2016 or Server 2019 (97%), Microsoft Windows Server 2022 (96%), Windows Server 2019 (95%), Microsoft Windows Server 2012 or 2012 R2 (94%), Microsoft Windows 10 1703 (93%), Windows Server 2022 (93%), Microsoft Windows 10 1511 (93%), Microsoft Windows Server 2012 (93%), Microsoft Windows Server 2016 (93%)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.95%E=4%D=7/17%OT=21%CT=1%CU=35364%PV=Y%DS=2%DC=I%G=Y%TM=68792C2
OS:9%P=aarch64-unknown-linux-gnu)SEQ(SP=103%GCD=1%ISR=10A%TI=I%CI=I%II=I%SS
OS:=S%TS=A)SEQ(SP=105%GCD=1%ISR=10A%TI=I%CI=I%II=I%SS=S%TS=A)SEQ(SP=106%GCD
OS:=1%ISR=105%TI=I%CI=I%II=I%SS=S%TS=A)SEQ(SP=106%GCD=1%ISR=10D%TI=I%CI=I%I
OS:I=I%SS=S%TS=A)SEQ(SP=108%GCD=1%ISR=10F%TI=I%CI=I%II=I%SS=S%TS=A)OPS(O1=M
OS:552NW8ST11%O2=M552NW8ST11%O3=M552NW8NNT11%O4=M552NW8ST11%O5=M552NW8ST11%
OS:O6=M552ST11)WIN(W1=FFFF%W2=FFFF%W3=FFFF%W4=FFFF%W5=FFFF%W6=FFDC)ECN(R=Y%
OS:DF=Y%T=80%W=FFFF%O=M552NW8NNS%CC=Y%Q=)T1(R=Y%DF=Y%T=80%S=O%A=S+%F=AS%RD=
OS:0%Q=)T2(R=Y%DF=Y%T=80%W=0%S=Z%A=S%F=AR%O=%RD=0%Q=)T3(R=Y%DF=Y%T=80%W=0%S
OS:=Z%A=O%F=AR%O=%RD=0%Q=)T4(R=Y%DF=Y%T=80%W=0%S=A%A=O%F=R%O=%RD=0%Q=)T5(R=
OS:Y%DF=Y%T=80%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=80%W=0%S=A%A=O%F=
OS:R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=80%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T
OS:=80%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=80%CD=
OS:Z)

Network Distance: 2 hops

OS detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 10.88 seconds
```

---

### Target Identification

{{< tab set1 tab1 >}}TCP{{< /tab >}}
{{< tab set1 tab2 >}}UDP{{< /tab >}}
{{< tab set1 tab3 >}}Script{{< /tab >}}
{{< tab set1 tab4 >}}Proxychains{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Scan All Ports

```console
nmap -p- --min-rate 10000 -oA ./nmap-tcp <TARGET>
```

#### 2. Filter Opened Ports

```console
PORTS=$(cat nmap-tcp.nmap | grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

#### 3. Service/Script Scan

```console
nmap -p $PORTS -sCV -oA ./nmap-tcp-scripts <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Scan Default UDP Ports

```console
nmap -sU --min-rate 10000 -oA ./nmap-udp <TARGET>
```

#### 2. Filter Opened/Filtered Ports

```console
PORTS=$(cat nmap-udp.nmap | grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

#### 3. Service/Script Scan

```console
nmap -p $PORTS -sU -sCV -oA ./nmap-udp-scripts <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Update Scripts Database

```console
nmap --script-updatedb
```

#### Search Scripts

```console
nmap --script-help <KEYWORD>*
```

```console {class="sample-code"}
nmap --script-help ftp*
```

#### Scan with Script

```console
nmap --script=<SCRIPT> -sV -sC -p <PORT> <TARGET>
```

```console {class="sample-code"}
nmap --script=ftp-anon -sV -sC -p 21 192.168.1.1
```

#### Scan with Script Wildcard

```console
nmap --script=<KEYWORD>* -sV -sC -p <PORT> <TARGET>
```

```console {class="sample-code"}
nmap --script=smb-vuln* -sV -sC -p 445 192.168.1.1
```

#### Run Script with Arguments

```console
nmap --script=<SCRIPT> --script-args='<ARG>' -p <PORT> <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

#### 1. Scan Common Ports

```console
proxychains4 -q nmap -sCV -sT -Pn --unprivileged <TARGET>
```

{{< /tabcontent >}}