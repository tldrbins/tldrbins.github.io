---
title: "Bloodhound"
date: 2025-8-2
tags: ["Bloodhound", "Sharphound", "Sliver", "Enumeration", "Active Directory", "Windows", "Neo4J", "DNS", "dnschef", "LDAP", "ldapsearch"]
---

### Info Collection (From Linux)

{{< tab set1 tab1 >}}bloodhound-python{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tab set1 tab3 >}}ldapsearch{{< /tab >}}
{{< tab set1 tab4 >}}certipy-ad{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Password
bloodhound-python -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -dc <DC> -ns <DC_IP> -c all --zip
```

```console {class="sample-code"}
$ python3 bloodhound.py -d rebound.htb -u oorend -p '1GR8t@$$4u' -dc dc01.rebound.htb -ns 10.10.11.231 -c all --zip 
INFO: Found AD domain: rebound.htb
INFO: Getting TGT for user
INFO: Connecting to LDAP server: dc01.rebound.htb
WARNING: LDAP Authentication is refused because LDAP signing is enabled. Trying to connect over LDAPS instead...
INFO: Found 1 domains

---[SNIP]---

INFO: Found 0 trusts
INFO: Starting computer enumeration with 10 workers
INFO: Querying computer: dc01.rebound.htb
INFO: Done in 00M 50S
INFO: Compressing output into 20240923035110_bloodhound.zip
```

```console
# NTLM
bloodhound-python -d <DOMAIN> -u '<USER>' --hashes ':<HASH>' -dc <DC> -ns <DC_IP> -c all --zip
```

```console
# Kerberos
sudo ntpdate -s <DC_IP> && bloodhound-python -u '<USER>' -k -d <DOMAIN> -dc <DC> -ns <DC_IP> -c all --zip -no-pass --use-ldaps
```

<small>*Note: passing '-no-pass' will still ask for password, press enter*</small>

#### Fix Name Resolving Issue

```console
# Build a DNS server to proxy name resolving request
python3 dnschef.py --fakeip <DC_IP>
``` 

```console
# Password
bloodhound-python -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' -dc <DC> -ns 127.0.0.1 -c all --zip
```

<small>*Ref: [bloodhound-python](https://github.com/dirkjanm/BloodHound.py)*</small>
<small>*Ref: [dnschef](https://github.com/iphelix/dnschef)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Password
nxc ldap <DC> -u '<USER>' -p '<PASSWORD>' --bloodhound --collection All --dns-server <DC_IP>
```

```console
# NTLM
nxc ldap <DC> -u '<USER>' -H '<HASH>' --bloodhound --collection All --dns-server <DC_IP>
```

```console
# Kerberos
nxc ldap <DC> -u '<USER>' -k --use-kcache --bloodhound --collection All --dns-server <DC_IP>
```

```console
# Socks5
proxychains4 -q nxc ldap <DC> -u '<USER>' -p '<PASSWORD>' --bloodhound --collection All --dns-tcp --dns-server <DC_IP>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### 1. Installation

```console
sudo apt install libsasl2-modules-gssapi-mit
```

#### 2. Config '/etc/krb5.conf'

```console
# In UPPER case

[libdefaults]
    default_realm = <DOMAIN>

[realms]
    <DOMAIN> = {
        kdc = <DC>:88
        admin_server = <DC>
        default_domain = <DOMAIN>
    }
    
[domain_realm]
    .domain.internal = <DOMAIN>
    domain.internal = <DOMAIN>
```

```console {class="sample-code"}
[libdefaults]
    default_realm = LUSTROUS2.VL

[realms]
    LUSTROUS2.VL = {
        kdc = LUS2DC.LUSTROUS2.VL:88
        admin_server = LUS2DC.LUSTROUS2.VL
        default_domain = LUSTROUS2.VL
    }
    
[domain_realm]
    .domain.internal = LUSTROUS2.VL
    domain.internal = LUSTROUS2.VL
```

#### 3. Request a TGT

```console
sudo ntpdate -s <DC_IP> && impacket-getTGT '<DOMAIN>/<USER>:<PASSWORD>' -dc-ip <DC_IP>
```

```console {class="sample-code"}
$ sudo ntpdate -s 10.10.84.194 && impacket-getTGT 'lustrous2.vl/Thomas.Myers:Lustrous2024' -dc-ip 10.10.84.194
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Thomas.Myers.ccache
```

#### 4. Check

```console
# Import ticket
export KRB5CCNAME='<USER>.ccache'
```

```console {class="sample-code"}
$ export KRB5CCNAME='Thomas.Myers.ccache'
```

```console
# Check ticket
klist
```

```console {class="sample-code"}
$ klist
Ticket cache: FILE:Thomas.Myers.ccache
Default principal: Thomas.Myers@LUSTROUS2.VL

Valid starting       Expires              Service principal
2025-08-05T05:32:51  2025-08-05T15:32:51  krbtgt/LUSTROUS2.VL@LUSTROUS2.VL
        renew until 2025-08-06T05:32:50
```

#### 5. LDAP Search

```console
ldapsearch -LLL -H ldap://<DC> -Y GSSAPI -b "DC=<EXAMPLE>,DC=<COM>" -N -o ldif-wrap=no -E '!1.2.840.113556.1.4.801=::MAMCAQc=' "(&(objectClass=*))" | tee ldap.txt
```

```console {class="sample-code"}
$ ldapsearch -LLL -H ldap://LUS2DC.lustrous2.vl -Y GSSAPI -b "DC=LUSTROUS2,DC=VL" -N -o ldif-wrap=no -E '!1.2.840.113556.1.4.801=::MAMCAQc=' "(&(objectClass=*))" | tee ldap.txt
SASL/GSSAPI authentication started
SASL username: Thomas.Myers@LUSTROUS2.VL
SASL SSF: 256
SASL data security layer installed.
dn: DC=Lustrous2,DC=vl
objectClass: top
objectClass: domain
objectClass: domainDNS
distinguishedName: DC=Lustrous2,DC=vl
instanceType: 5
---[SNIP]---
```

#### 6. Convert to BofHound Format

```console
python3 ldapsearch_parser.py ldap.txt ldap2.txt
```

#### 7. Convert to Bloodhound Format

```console
bofhound --input ldap2.txt --output <DC>_bloodhound --zip
```

<small>*Ref: [ldapsearch_parser](https://gist.github.com/kozmer/725cde788e4b3c8bdd870468c243916b)*</small>
<br>
<small>*Ref [bofhound](https://github.com/fortalice/bofhound)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

```console
certipy-ad find -u '<USER>' -p '<PASSWORD>' -target <TARGET>
```

{{< /tabcontent >}}

### Info Collection (From Windows)

{{< tab set2 tab1 >}}SharpHound.exe{{< /tab >}}
{{< tab set2 tab2 >}}SharpHound.ps1{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Without Cred
.\SharpHound.exe -c all --outputdirectory C:\ProgramData
```

```console
# With Cred
.\SharpHound.exe -c all --outputdirectory C:\ProgramData --ldapusername '<USER>' --ldappassword '<PASSWORD>'
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Import module
. .\SharpHound.ps1
```

```console
# Run
Invoke-BloodHound -CollectionMethods All -OutputDirectory C:\ProgramData
```

<small>*Ref: [sharphound.ps1](https://github.com/BloodHoundAD/BloodHound/blob/master/Collectors/SharpHound.ps1)*</small>

{{< /tabcontent >}}

### Info Collection (From C2)

{{< tab set3 tab1 >}}Sliver{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
sharp-hound-4 -- '-c all --outputdirectory C:\ProgramData'
```

<small>*Note: passing '-no-pass' will still ask for password, press enter*</small>

{{< /tabcontent >}}

---

### Bloodhound

```console
# Start neo4j server
sudo neo4j console
```

```console
# Start bloodhound
bloodhound
```

### Bloodhound (with PKI Support)

```console
# Fix: GPU process isn't usable. Goodbye.
./BloodHound --no-sandbox
```

<small>*Ref: [BloodHound (with PKI support)](https://github.com/ly4k/BloodHound)*</small>
