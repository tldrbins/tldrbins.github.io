---
title: "Bloodhound"
date: 2024-7-9
tags: ["Bloodhound", "Sharphound", "Sliver", "Enumeration", "Active Driectory", "Windows", "Neo4J"]
---

### Info Collection (From Linux)

{{< tab set1 tab1 active >}}bloodhound-python{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# With password
bloodhound-python -d <DOMAIN> -u <USER> -p '<PASSWORD>' -dc <DC> -ns <DC_IP> -c all --zip
```

```console
# With Kerberos
sudo ntpdate -s <DC> && bloodhound-python -u <USER> -k -d <DOMAIN> -dc <DC> -ns <DC_IP> -c all --zip -no-pass --use-ldaps
```

<small>*Note: passing '-no-pass' will still ask for password, press enter*</small>

{{< /tabcontent >}}

### Info Collection (From Windows)

{{< tab set2 tab1 active >}}SharpHound.exe{{< /tab >}}
{{< tab set2 tab2 >}}SharpHound.ps1{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
.\SharpHound.exe -c all --outputdirectory C:\ProgramData
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

{{< tab set3 tab1 active >}}Sliver{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
sharp-hound-4 --  '-c all --outputdirectory C:\ProgramData'
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
