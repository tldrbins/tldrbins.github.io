---
title: "Microsoft Access Database"
date: 2024-7-8
tags: ["Database Dumping", "Access", "Database", "Windows", "Mdb"]
---

### Tools

{{< tab set1 tab1 active >}}mdbtools{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
sudo apt install mdbtools
```

#### Basic

```console
# Show all tables
mdb-tables <MDB_FILE> 
```

```console {class="sample-code"}
$ mdb-tables backup.mdb                                                    
acc_antiback acc_door acc_firstopen acc_firstopen_emp acc_holidays acc_interlock ...[SNIP]...
```

```console
# Show tables with data
mdb-tables <MDB_FILE> | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export <MDB_FILE> $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
```

```console {class="sample-code"}
$ mdb-tables backup.mdb | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export backup.mdb $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
acc_timeseg: 2
acc_wiegandfmt: 12
ACGroup: 6
action_log: 25
areaadmin: 4
auth_user: 4
...[SNIP]...
```

```console
# Dump data from table
mdb-export <MDB_FILE> <TABLE_NAME>
```

```console {class="sample-code"}
$ mdb-export backup.mdb auth_user
id,username,password,Status,last_login,RoleID,Remark
25,"admin","admin",1,"08/23/18 21:11:47",26,
27,"engineer","access4u@security",1,"08/23/18 21:13:36",26,
28,"backup_admin","admin",1,"08/23/18 21:14:02",26,
```

{{< /tabcontent >}}
