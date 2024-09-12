---
title: "Nmap"
date: 2024-6-26
tags: ["nmap", "port", "network", "discovery", "reconnaissance", "scan", "enum"]
---

### Nmap Scan

{{< tab set1 tab1 active >}}TCP{{< /tab >}}
{{< tab set1 tab2 >}}UDP{{< /tab >}}
{{< tab set1 tab3 >}}Script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
target=<TARGET>
```

```console
nmap -p- --min-rate 10000 -oA ./nmap-alltcp $target
```

```console
ports=$(cat nmap-alltcp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

```console
nmap -p $ports -sCV -oA ./nmap-tcpscripts $target
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
target=<TARGET>
```

```console
nmap -sU --min-rate 10000 -oA ./nmap-udp $target
```

```console
ports=$(cat nmap-udp.nmap| grep -Eo "^[0-9]+" | tr '\n' ',' | sed -r 's/,$//')
```

```console
nmap -p $ports -sU -sCV -oA ./nmap-udpscripts $target
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Update scripts DB

<div>

```console
nmap --script-updatedb
```

</div>

#### Search scripts

<div>

```console
nmap --script-help ftp*
```

</div>

#### Scan with a script

<div>

```console
nmap --script=ftp-anon -sV -sC -p 21 <TARGET>
```

</div>

#### Scan with all scripts

<div>

```console
nmap --script=smb-vuln* -sV -sC -p 445 <TARGET>
```

</div>

#### Run script with args

<div>

```console
nmap -p <TARGET_PORT> <TARGET> --script <SCRIPT_NAME> --script-args="<SCRIPT_ARGS>"
```

</div>

{{< /tabcontent >}}

<br>