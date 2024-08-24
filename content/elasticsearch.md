---
title: "elasticsearch"
date: 2024-7-10
tags: ["elasticsearch", "database"]
---

---
### Basic Commands

```bash
# List indexes
curl -s http://example.com:9200/_cat/indices?v
```

```bash
# Dump data with index name
curl -s -X GET "http://example.com:9200/<INDEX_NAME>/_search?size=100" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}
' | jq .
```

<br>