---
title: "Mysql General"
date: 2024-6-27
tags: ["mysql", "database"]
---

---
### General

#### Connect to mysql Database

```bash
# Database unknown
mysql -u <USER> -h <TARGET> -p<PASSWORD>
```

```bash
# Database known
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p<PASSWORD>
```

```bash
# Execute query inline
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p<PASSWORD> -e 'show tables;'
```

#### Basic Commands

```mysql
# Show all databases
show databases;
```

```mysql
# Choose database
use <DB_NAME>;
```

```mysql
# Show all tables
show tables;
```

```mysql
# Show all entries in table_name
select * from <TABLE_NAME>;
```

#### Update Entry

```mysql
# Update Entry Example
UPDATE users set user_type='Administrator' where email='test@example.com';
```

#### Arbitrary File Read

```mysql
select load_file("/etc/passwd");
```

<br>