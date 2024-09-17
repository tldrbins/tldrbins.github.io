---
title: "MongoDB General"
date: 2024-6-27
tags: ["Database Dumping", "Mongodb", "Database", "Enumeration"]
---

### General

#### Connect to Mongo Database

{{< tab set1 tab1 active >}}anonymous{{< /tab >}}
{{< tab set1 tab2 >}}authenticate{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
mongo <TARGET>:27017
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Connect local with creds and specified database
mongo -u <USER> -p '<PASSWORD>' <DB_NAME>
```

{{< /tabcontent >}}

#### Basic Commands

```console
# Show all databases
show dbs
```

```console
# Choose database
use <DB_NAME>
```

```console
# Show all collections
show collections
```

```console
# Show all of the collection
db.<COLLECTION_NAME>.find().pretty()
```

```console
# Insert entry into collections
db.<COLLECTION_NAME>.insert({"<key>": "<value>"})
```

```console
# Update an entry (e.g. password of user)
db.<COLLECTION_NAME>.update({"username": "user"}, {$set: {"password": "password"}});
```
