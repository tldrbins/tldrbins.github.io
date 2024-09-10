---
title: "Web Directory Enum"
date: 2024-6-27
tags: ["web", "directory", "domain", "feroxbuster", "enum", "wfuzz", "idor", "gobuster", ".ds_store"]
---

---
{{< tab set1 tab1 active >}}feroxbuster{{< /tab >}}
{{< tab set1 tab2 >}}wfuzz{{< /tab >}}
{{< tab set1 tab3 >}}gobuster{{< /tab >}}
{{< tab set1 tab4 >}}bfac{{< /tab >}}
{{< tab set1 tab5 >}}ds_walk{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### HTTP

<div>

```bash
feroxbuster -u http://example.com/ --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

</div>

#### HTTPS

<div>

```bash
feroxbuster -u https://example.com/ -k --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --dont-extract-links
```

</div>

#### Specify Extension

<div>

```bash
feroxbuster -u http://example.com/ --methods=GET,POST --depth=1 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x html, asp, aspx
```

</div>

#### Add trailing slash '/' to each request

<div>

```bash
feroxbuster -u http://example.com/ -f --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

</div>

#### API Fuzzing

<div>

```bash
feroxbuster -u http://example.com/ --force-recursion -C 404,405 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Fuzzing Number Range

<div>

```bash
wfuzz -z range,1-99 http://example.com/users/FUZZ
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
gobuster dir -u http://example.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -t 40 -x php
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

<div>

```bash
# BFAC (Backup File Artifacts Checker)
bfac --url http://example.com
```

</div>

<small>*Ref: [BFAC](https://github.com/mazen160/bfac)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```bash
python3 ds_walk.py -u http://example.com
```

</div>

<small>*Ref: [DS_WALK](https://github.com/Keramas/DS_Walk)*</small>

{{< /tabcontent >}}

<br>