---
title: "MySQL General"
date: 2025-7-25
tags: ["Database Dumping", "Privilege Escalation In Databases", "Mysql", "Database"]
---

### Connect to MySQL Database

```console
mysql -u <USER> -h <TARGET> -p'<PASSWORD>'
```

```console
# Database known
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p'<PASSWORD>'
```

```console
# Skip SSL
mysql -u <USER> -h <TARGET> -p'<PASSWORD>' --skip-ssl
```

```console
# Execute query inline
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p'<PASSWORD>' -e '<QUERY>'
```

```console {class="sample-code"}
mysql -u <USER> -D <DB_NAME> -h <TARGET> -p'<PASSWORD>' -e 'show tables;'
```

---

### General

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

---

### Insert Entry

```console
INSERT INTO <TABLE_NAME> (<COLUMN_1>,<COLUMN_2>,...) VALUES (<VALUE_1>,<VALUE_2>,...);
```

---

### Update Entry

```console
# Update Entry Example
UPDATE users set user_type='Administrator' where email='test@example.com';
```

---

### Arbitrary File Read

```console
select load_file("<FILE>");
```

```console {class="sample-code"}
select load_file("/etc/passwd");
```