---
title: "Web Directory Enum"
date: 2024-6-27
tags: ["Waf (Web Application Firewall)", "Gobuster", "Enumeration", "Reconnaissance", "Web", "Directory", "Feroxbuster", "Wfuzz", "IDOR", ".Ds_Store"]
---

{{< tab set1 tab1 >}}feroxbuster{{< /tab >}}
{{< tab set1 tab2 >}}wfuzz{{< /tab >}}
{{< tab set1 tab3 >}}gobuster{{< /tab >}}
{{< tab set1 tab4 >}}bfac{{< /tab >}}
{{< tab set1 tab5 >}}ds_walk{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### HTTP

```console
feroxbuster -u <TARGET> --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

#### HTTPS

```console
feroxbuster -u <TARGET> -k --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

#### Specify Extension

```console
feroxbuster -u <TARGET> --methods=GET,POST --depth=1 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x html, asp, aspx
```

#### Add trailing slash '/' to each request

```console
feroxbuster -u <TARGET> -f --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

#### API Fuzzing

```console
feroxbuster -u <TARGET> --force-recursion -C 404,405 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Fuzzing Number Range

```console
wfuzz -z range,1-99 <TARGET>/FUZZ
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
gobuster dir -u <TARGET> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -t 40 -x php
```

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

```console
# BFAC (Backup File Artifacts Checker)
bfac --url <TARGET>
```

<small>*Ref: [BFAC](https://github.com/mazen160/bfac)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

```console
python3 ds_walk.py -u <TARGET>
```

<small>*Ref: [DS_WALK](https://github.com/Keramas/DS_Walk)*</small>

{{< /tabcontent >}}
