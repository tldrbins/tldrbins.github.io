---
title: "Winrm from Windows VM"
date: 2024-9-6
tags: ["winrm", "pssession", "Windows", "file transfer", "kerberos"]
---

### Preparation

#### 0. Check Systeminfo

<div>

```console
# Windows Pro is needed
systeminfo
```

</div>

#### 1. Connect to VPN

[OpenVPN client](https://openvpn.net/client/)

#### 2. Add DNS Server

<div>

```console
+-----------------------------------------------------------------------------------+
| 1. Go to 'Control Panel\Network and Internet\Network and Sharing Center'          |
| 2. Click 'Local Area Connection'                                                  |
| 3. Go to 'Properties' -> 'Internet Protocol Version 4 (TCP/IPv4)' -> 'Properties' |
| 4. Under 'General', check 'Obtain an IP address automatically'                    |
| 5. Check 'Use the following DNS address' -> 'Prefer DNS Server' -> <DC_IP>        |
+-----------------------------------------------------------------------------------+
```

</div>

#### 3. Add domain to hosts

<div>

```
+--------------------------------------------------------+
| 1. Run text editor as Administrator                    |
| 2. Add '<TARGET> <DC_COMPUTER_NAME> <DC> <DOMAIN>'     |
|    to 'C:\Windows\System32\drivers\etc\hosts'          |
+--------------------------------------------------------+
```

</div>

#### 4. Add computer to domain

<div>

```
+--------------------------------------------------------------------+
| 1. 'Control Panel' -> Search 'Domain'                              |
| 2. Click 'Join a Domain'                                           |
| 3. Under tab 'Computer Name' -> 'Change'                           |
| 4. Check 'Domain' -> '<DOMAIN>'                                    |
| 5. Enter username and password (domain user)                       |
| 6. If succeed, will pop an alert, 'Welcome to DOMAIN domain.'      |
+--------------------------------------------------------------------+
```

</div>

#### 5. Sync Time with DC

{{< tab set1 tab1 active >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
W32tm /resync /force
```

</div>

{{< /tabcontent >}}

<br>

---

### Authentication

{{< tab set2 tab1 active >}}Kerberos{{< /tab >}}
{{< tab set2 tab2 >}}Credentials{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Get TGT ticket

<div>

```console
# Get a Kerberos ticket
.\Rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console
# Check
klist
```

</div>

#### 2. PSSession

<div>

```console
# Create new pssession
New-PSSession -ComputerName <DC_COMPUTER_NAME>
```

```console
# Enter pssession
Enter-PSSession -Id 1
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Set trusted hosts

<div>

```console
# cmd
winrm quickconfig
```

```console
winrm set winrm/config/client @{TrustedHosts="*"}
```

```console
# powershell
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*" -Force
```

</div>

#### 2. Enable CredSSP

<div>

```console
# powershell
Enable-WSManCredSSP -Role "Client" -DelegateComputer "*"
```

</div>

#### 3. Create cred object

<div>

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

</div>

#### 4. PSSession

<div>

```console
$s1 = New-PSSession -ComputerName <DC_COMPUTER_NAME> -Credential $cred
Enter-PSSession $s1
```

</div>

{{< /tabcontent >}}

<br>

---

### Copy files from remote pssession to local

{{< tab set3 tab1 active >}}powershell{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```console
Exit-PSSession
```

```console
Copy-Item '<REMOTE_FILE_PATH>'  -Destination '<LOCAL_FILE_PATH>' -FromSession $s1
```

</div>

{{< /tabcontent >}}

<br>