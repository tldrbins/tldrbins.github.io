---
title: "Secure String"
date: 2024-7-10
tags: ["powershell", "secure strings", "Windows", "decrypt"]
---

---
### Decrypt secure string

```powerhsell
$s = cat pass.xml
```

```powerhsell
$ss = Convertto-securestring -string $s
```

```powerhsell
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "administrator", $ss
```

```powerhsell
$cred.GetNetworkCredential().password
```

<br>
