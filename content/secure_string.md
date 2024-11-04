---
title: "Secure String"
date: 2024-7-10
tags: ["Powershell", "Secure Strings", "Windows", "Decrypt"]
---

### Decrypt secure string

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
$s = cat pass.xml
```

```console {class="sample-code"}
PS C:\programdata> $s = "01000000d0 ...[SNIP]... e63b3f24ec"
```

```console
$ss = Convertto-securestring -string $s
```

```console {class="sample-code"}
PS C:\programdata> $ss = Convertto-securestring -string $s
$ss = Convertto-securestring -string $s
```

```console
# Decrypt
(New-Object System.Management.Automation.PSCredential 'N/A', $ss).GetNetworkCredential().Password
```

```console {class="sample-code"}
PS C:\programdata> (New-Object System.Management.Automation.PSCredential 'N/A', $ss).GetNetworkCredential().Password
(New-Object System.Management.Automation.PSCredential 'N/A', $ss).GetNetworkCredential().Password
AhXpFsOusi ...[SNIP]... 0LxlUqc0Y=
```

```console
# Or save as cred
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "<USER>", $ss
```

```console
$cred.GetNetworkCredential().password
```

{{< /tabcontent >}}
