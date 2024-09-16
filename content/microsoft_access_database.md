---
title: "Microsoft Access Database"
date: 2024-7-8
tags: ["Access", "database", "Windows", "mdb"]
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

```console
# Show tables with data
mdb-tables <MDB_FILE> | tr ' ' '\n' | grep . | while read table; do lines=$(mdb-export <MDB_FILE> $table | wc -l); if [ $lines -gt 1 ]; then echo "$table: $lines"; fi; done
```

```console
# Dump data from table
mdb-export <MDB_FILE> <TABLE_NAME>
```

{{< /tabcontent >}}
