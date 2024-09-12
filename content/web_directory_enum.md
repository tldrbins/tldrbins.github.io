---
title: "Web Directory Enum"
date: 2024-6-27
tags: ["web", "directory", "domain", "feroxbuster", "enum", "wfuzz", "idor", "gobuster", ".ds_store"]
---

{{< tab set1 tab1 active >}}feroxbuster{{< /tab >}}
{{< tab set1 tab2 >}}wfuzz{{< /tab >}}
{{< tab set1 tab3 >}}gobuster{{< /tab >}}
{{< tab set1 tab4 >}}bfac{{< /tab >}}
{{< tab set1 tab5 >}}ds_walk{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### HTTP

<div>

```console
feroxbuster -u http://<TARGET>/ --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

</div>

#### HTTPS

<div>

```console
feroxbuster -u https://<TARGET>/ -k --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

</div>

#### Specify Extension

<div>

```console
feroxbuster -u http://<TARGET>/ --methods=GET,POST --depth=1 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x html, asp, aspx
```

</div>

#### Add trailing slash '/' to each request

<div>

```console
feroxbuster -u http://<TARGET>/ -f --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

</div>

#### API Fuzzing

<div>

```console
feroxbuster -u http://<TARGET>/ --force-recursion -C 404,405 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Fuzzing Number Range

<div>

```console
wfuzz -z range,1-99 http://<TARGET>/users/FUZZ
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
gobuster dir -u http://<TARGET> -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -t 40 -x php
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

<div>

```console
# BFAC (Backup File Artifacts Checker)
bfac --url http://<TARGET>
```

</div>

<small>*Ref: [BFAC](https://github.com/mazen160/bfac)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```console
python3 ds_walk.py -u http://<TARGET>
```

</div>

<small>*Ref: [DS_WALK](https://github.com/Keramas/DS_Walk)*</small>

{{< /tabcontent >}}

<br>