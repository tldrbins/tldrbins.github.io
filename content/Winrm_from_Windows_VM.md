---
title: "Winrm from Windows VM"
date: 2025-7-25
tags: ["Kerberos", "Pass-The-Ticket", "Domain", "Http File Transfer", "Authentication", "Ticket Granting Ticket", "Domain Controller", "Winrm", "Pssession", "Windows", "File Transfer", "Active Directory"]
---

### Preparation

#### 0. Check Systeminfo

```console
# Windows Pro is needed
systeminfo
```

#### 1. Connect to VPN

[OpenVPN client](https://openvpn.net/client/)

#### 2. Add DNS Server

```console
+-----------------------------------------------------------------------------------+
| 1. Go to 'Control Panel\Network and Internet\Network and Sharing Center'          |
| 2. Click 'Local Area Connection'                                                  |
| 3. Go to 'Properties' -> 'Internet Protocol Version 4 (TCP/IPv4)' -> 'Properties' |
| 4. Under 'General', check 'Obtain an IP address automatically'                    |
| 5. Check 'Use the following DNS address' -> 'Prefer DNS Server' -> <DC_IP>        |
+-----------------------------------------------------------------------------------+
```

#### 3. Add Domain to Hosts

```
+--------------------------------------------------------+
| 1. Run text editor as Administrator                    |
| 2. Add '<TARGET> <COMPUTER_NAME> <DC> <DOMAIN>'     |
|    to 'C:\Windows\System32\drivers\etc\hosts'          |
+--------------------------------------------------------+
```

#### 4. Add Computer to Domain

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

#### 5. Sync Time with DC

{{< tab set1 tab1 >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
W32tm /resync /force
```

{{< /tabcontent >}}

---

### Authentication

{{< tab set2 tab1 >}}Kerberos{{< /tab >}}
{{< tab set2 tab2 >}}Credentials{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### 1. Get TGT Ticket

```console
# Get a Kerberos ticket
.\rubeus.exe asktgt /user:<USER> /password:'<PASSWORD>' /enctype:AES256 /domain:<DOMAIN> /dc:<DC> /ptt /nowrap
```

```console
# Check
klist
```

#### 2. PSSession

```console
# Create new pssession
New-PSSession -ComputerName <COMPUTER_NAME>
```

```console
# Enter pssession
Enter-PSSession -Id 1
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Set Trusted Hosts

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

#### 2. Enable CredSSP

```console
# powershell
Enable-WSManCredSSP -Role "Client" -DelegateComputer "*"
```

#### 3. Create Cred Object

```console
$username = '<DOMAIN>\<USER>'
```

```console
$password = ConvertTo-SecureString '<PASSWORD>' -AsPlainText -Force
```

```console
$cred = New-Object System.Management.Automation.PSCredential($username, $password)
```

#### 4. PSSession

```console
$s1 = New-PSSession -ComputerName <COMPUTER_NAME> -Credential $cred
```

```console
Enter-PSSession $s1
```

{{< /tabcontent >}}

---

### Copy Files Between Remote and Local

{{< tab set3 tab1 >}}powershell{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
Exit-PSSession
```

```console
# Local to remote
Copy-Item '<LOCAL_FILE_PATH>' -Destination '<REMOTE_FILE_PATH>' -ToSession $s1
```

```console
# Remote to local
Copy-Item '<REMOTE_FILE_PATH>' -Destination '<LOCAL_FILE_PATH>' -FromSession $s1
```

{{< /tabcontent >}}
