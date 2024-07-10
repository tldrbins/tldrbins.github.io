---
title: "elasticsearch"
date: 2024-7-10
tags: ["elasticsearch", "database"]
---

---
### Basic Commands

```bash
# List indexes
curl -s http://10.10.11.10:9200/_cat/indices?v
```

```bash
# Dump data with index name (e.g. index_name)
curl -s -X GET "http://10.10.11.10:9200/index_name/_search?size=100" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}
' | jq .
```

<br>