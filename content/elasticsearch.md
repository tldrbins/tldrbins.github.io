---
title: "elasticsearch"
date: 2024-7-10
tags: ["elasticsearch", "database"]
---

### Basic Commands

```console
# List indexes
curl -s <TARGET>:9200/_cat/indices?v
```

```console
# Dump data with index name
curl -s -X GET "<TARGET>:9200/<INDEX_NAME>/_search?size=100" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}
' | jq .
```
