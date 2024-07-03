---
title: "Web Directory Enum"
date: 2024-6-27
tags: ["web", "directory", "domain", "feroxbuster", "enum", "wfuzz", "idor", "gobuster"]
---

---
### feroxbuster

[Download feroxbuster](https://github.com/epi052/feroxbuster)

#### HTTP

```bash
feroxbuster -u http://example.com/ --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

#### HTTPS

```bash
feroxbuster -u https://example.com/ -k --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

#### Specify Extension

```bash
feroxbuster -u http://example.com/ --methods=GET,POST --depth=1 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -x html, asp, aspx
```

#### Add trailing slash `/` to each request

```bash
feroxbuster -u http://example.com/ -f --depth 1 --methods=GET,POST -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```

<br>

--- 

### wfuzz

#### Fuzzing Number Range

```bash
wfuzz -z range,1-99 http://example.com/users/FUZZ
```

<br>

---

### gobuster

[Download gobuster](https://github.com/OJ/gobuster)

```bash
gobuster dir -u http://example.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt -t 40 -x php
```

<br>