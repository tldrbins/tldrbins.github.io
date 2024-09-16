---
title: "Mysql General"
date: 2024-6-27
tags: ["mysql", "database"]
---

### General

#### Connect to mysql Database

```console
# Database unknown
mysql -u <USER> -h <TARGET> -p'<PASSWORD>'
```

```console
# Database known
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p'<PASSWORD>'
```

```console
# Execute query inline
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p'<PASSWORD>' -e 'show tables;'
```

#### Basic Commands

```console
# Show all databases
show databases;
```

```console
# Choose database
use <DB_NAME>;
```

```console
# Show all tables
show tables;
```

```console
# Show all entries in table_name
select * from <TABLE_NAME>;
```

#### Update Entry

```console
# Update Entry Example
UPDATE users set user_type='Administrator' where email='test@example.com';
```

#### Arbitrary File Read

```console
select load_file("/etc/passwd");
```
