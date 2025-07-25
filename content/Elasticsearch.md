---
title: "Elasticsearch"
date: 2025-7-25
tags: ["Database Dumping", "Elasticsearch", "Database"]
---

### General

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
