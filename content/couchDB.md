---
title: "CouchDB"
date: 2024-7-5
tags: ["couchDB", "database", "5984"]
---

---
### Basic

<div>

```bash
# Show all databases
curl http://localhost:5984/_all_dbs
```

```bash
# Show all databases (With Creds)
curl http://<USER>:<PASSWORD>@localhost:5984/_all_dbs
```

```bash
# Show all docs from database
curl http://localhost:5984/<DB_NAME>/_all_docs
```

```bash
# Show a entry
curl http://localhost:5984/<DB_NAME>/<ID_HASH>
```

</div>

<br>