---
title: "Winrm from Windows VM"
date: 2024-9-6
tags: ["winrm", "pssession", "Windows", "file transfer", "kerberos"]
---

---
### Preparation

#### 0. Check Systeminfo

<div>

```powershell
# Windows Pro is needed
systeminfo
```

</div>

#### 1. Connect to VPN

[OpenVPN client](https://openvpn.net/client/)

#### 2. Add DNS Server

<div>

```
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
| 2. Add '10.10.11.10 DC01 dc01.example.com example.com' |
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
| 4. Check 'Domain' -> 'example.com'                                 |
| 5. Enter username and password (domain user)                       |
| 6. If succeed, will pop an alert, 'Welcome to example.com domain.' |
+--------------------------------------------------------------------+
```

</div>

#### 5. Sync Time with DC

{{< tab set1 tab1 active >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```powershell
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

```powershell
# Get a Kerberos ticket
.\Rubeus.exe asktgt /user:<USER> /password:<PASSWORD> /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```bash
# Check
klist
```

</div>

#### 2. PSSession

<div>

```powershell
# Create new pssession
New-PSSession -ComputerName DC01
```

```powershell
# Enter pssession
Enter-PSSession -Id 1
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Set trusted hosts

<div>

```powershell
# cmd
winrm quickconfig
```

```powershell
winrm set winrm/config/client @{TrustedHosts="*"}
```

```powershell
# powershell
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*" -Force
```

</div>

#### 2. Enable CredSSP

<div>

```powershell
# powershell
Enable-WSManCredSSP -Role "Client" -DelegateComputer "*"
```

</div>

#### 3. Create cred object

<div>

```powershell
$username = '<DOMAIN>\<USER>'
```

```powershell
$password = ConvertTo-SecureString <PASSWORD> -AsPlainText -Force
```

```powershell
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

</div>

#### 4. PSSession

<div>

```powershell
$s1 = New-PSSession -ComputerName DC01 -Credential $cred
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

```powershell
Exit-PSSession
```

```powershell
Copy-Item '<REMOTE_FILE_PATH>'  -Destination '<LOCAL_FILE_PATH>' -FromSession $s1
```

</div>

{{< /tabcontent >}}

<br>