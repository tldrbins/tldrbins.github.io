---
title: "CouchDB"
date: 2025-7-25
tags: ["Database Dumping", "Couchdb", "Database"]
---

### General

```console
# Show all databases
curl http://localhost:5984/_all_dbs
```

```console
# Show all databases (With Creds)
curl http://<USER>:<PASSWORD>@localhost:5984/_all_dbs
```

```console
# Show all docs from database
curl http://localhost:5984/<DB_NAME>/_all_docs
```

```console
# Show a entry
curl http://localhost:5984/<DB_NAME>/<ID_HASH>
```
