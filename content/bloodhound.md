---
title: "Bloodhound"
date: 2024-7-9
tags: ["bloodhound", "enum", "active driectory", "ad", "Windows", "sharphound"]
---

---
### sharphound.ps1

[Download sharphound.ps1](https://github.com/BloodHoundAD/BloodHound/blob/master/Collectors/SharpHound.ps1)

```powershell
# Import module
. .\SharpHound.ps1
```

```powershell
# Run
Invoke-BloodHound -CollectionMethods All
```

### sharphound.exe

```powershell
.\SharpHound.exe -c all
```

### bloodhound.py

```bash
python3 bloodhound.py -d example.com -u username -p password -dc example.com -ns 10.10.11.10 -c all --zip
```

<br>