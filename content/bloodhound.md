---
title: "Bloodhound"
date: 2024-7-9
tags: ["bloodhound", "enum", "active driectory", "ad", "Windows", "sharphound", "neo4j"]
---

---
### Info Collection (From Linux)

{{< tab set1 tab1 active >}}bloodhound-python{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# With Creds
bloodhound-python -d <DOMAIN> -u <USER> -p <PASSWORD> -dc <DC> -ns <DC_IP> -c all --zip
```

```bash
# With Kerberos
sudo ntpdate -s <DC> && bloodhound-python -u <USER> -p <PASSWORD> -k -d <DOMAIN> -dc <DC> -ns <DC_IP> -c all --zip
```

</div>

{{< /tabcontent >}}

### Info Collection (From Windows)

{{< tab set2 tab1 active >}}SharpHound.exe{{< /tab >}}
{{< tab set2 tab2 >}}SharpHound.ps1{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```powershell
.\SharpHound.exe -c all --outputdirectory C:\ProgramData
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```powershell
# Import module
. .\SharpHound.ps1
```

```powershell
# Run
Invoke-BloodHound -CollectionMethods All -OutputDirectory C:\ProgramData
```

</div>

<small>*Ref: [sharphound.ps1](https://github.com/BloodHoundAD/BloodHound/blob/master/Collectors/SharpHound.ps1)*</small>

{{< /tabcontent >}}

<br>

---

### bloodhound

<div>

```bash
# Start neo4j server
sudo neo4j console
```

```bash
# Start bloodhound
bloodhound
```

</div>

### bloodhound (with PKI support)

<div>

```bash
# Fix: GPU process isn't usable. Goodbye.
./BloodHound --no-sandbox
```

</div>

<small>*Ref: [BloodHound (with PKI support)](https://github.com/ly4k/BloodHound)*</small>

<br>