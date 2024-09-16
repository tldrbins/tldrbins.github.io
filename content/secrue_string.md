---
title: "Secure String"
date: 2024-7-10
tags: ["powershell", "secure strings", "Windows", "decrypt"]
---

### Decrypt secure string

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
$s = cat pass.xml
```

```console
$ss = Convertto-securestring -string $s
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "administrator", $ss
```

```console
$cred.GetNetworkCredential().password
```

{{< /tabcontent >}}
