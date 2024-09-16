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

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

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

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### Update scripts DB

```console
nmap --script-updatedb
```

#### Search scripts

```console
# e.g. ftp
nmap --script-help ftp*
```

#### Scan with a script

```console
# e.g ftp-anon
nmap --script=ftp-anon -sV -sC -p 21 <TARGET>
```

#### Scan with wildcard

```console
# e.g. smb-vuln*
nmap --script=smb-vuln* -sV -sC -p 445 <TARGET>
```

#### Run script with args

```console
nmap -p <TARGET_PORT> <TARGET> --script <SCRIPT_NAME> --script-args='<SCRIPT_ARGS>'
```

{{< /tabcontent >}}
