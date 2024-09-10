---
title: "Nmap"
date: 2024-6-26
tags: ["nmap", "port", "network", "discovery", "reconnaissance", "scan", "enum"]
---

---
### Nmap Scan

{{< tab set1 tab1 active >}}TCP{{< /tab >}}
{{< tab set1 tab2 >}}UDP{{< /tab >}}
{{< tab set1 tab3 >}}Script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
target=10.10.11.10
```

```bash
nmap -p- --min-rate 10000 -oA ./nmap-alltcp $target
```

```bash
ports=$(cat nmap-alltcp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

```bash
nmap -p $ports -sCV -oA ./nmap-tcpscripts $target
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
target=10.10.11.10
```

```bash
nmap -sU --min-rate 10000 -oA ./nmap-udp $target
```

```bash
ports=$(cat nmap-udp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

```bash
nmap -p $ports -sU -sCV -oA ./nmap-udpscripts $target
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Update scripts DB

<div>

```bash
nmap --script-updatedb
```

</div>

#### Search scripts

<div>

```bash
nmap --script-help ftp*
```

</div>

#### Scan with a script

<div>

```bash
nmap --script=ftp-anon -sV -sC -p 21 10.10.11.10
```

</div>

#### Scan with all scripts

<div>

```bash
nmap --script=smb-vuln* -sV -sC -p 445 10.10.11.10
```

</div>

#### Run script with args

<div>

```bash
nmap -p 1234 10.10.11.10 --script <SCRIPT_NAME> --script-args="<SCRIPT_ARGS>"
```

</div>

{{< /tabcontent >}}

<br>