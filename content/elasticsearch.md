---
title: "elasticsearch"
date: 2024-7-10
tags: ["elasticsearch", "database"]
---

### Basic Commands

<div>

```console
# List indexes
curl -s http://<DOMAIN>:9200/_cat/indices?v
```

```console
# Dump data with index name
curl -s -X GET "http://<DOMAIN>:9200/<INDEX_NAME>/_search?size=100" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}
' | jq .
```

</div>

<br>