---
title: "Bloodhound"
date: 2024-7-9
tags: ["Bloodhound", "Sharphound", "Sliver", "Enumeration", "Active Directory", "Windows", "Neo4J"]
---

### Info Collection (From Linux)

{{< tab set1 tab1 >}}bloodhound-python{{< /tab >}}
{{< tab set1 tab2 >}}nxc{{< /tab >}}
{{< tab set1 tab3 >}}certipy-ad{{< /tab >}}
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

...[SNIP]...

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
sudo ntpdate -s <DC> && bloodhound-python -u '<USER>' -k -d <DOMAIN> -dc <DC> -ns <DC_IP> -c all --zip -no-pass --use-ldaps
```

<small>*Note: passing '-no-pass' will still ask for password, press enter*</small>

<small>*Ref: [BloodHound.py](https://github.com/dirkjanm/BloodHound.py)*</small>

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
proxychains4 -q nxc ldap <DC> -u '<USER>' -p '<PASSWORD>' --bloodhound --collection All --dcn-tcp --dns-server <DC_IP>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

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

### bloodhound

```console
# Start neo4j server
sudo neo4j console
```

```console
# Start bloodhound
bloodhound
```

### bloodhound (with PKI support)

```console
# Fix: GPU process isn't usable. Goodbye.
./BloodHound --no-sandbox
```

<small>*Ref: [BloodHound (with PKI support)](https://github.com/ly4k/BloodHound)*</small>
