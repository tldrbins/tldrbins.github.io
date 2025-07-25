---
title: "Windows Event Logs"
date: 2025-7-25
tags: ["Forensics", "Evtx", "Event Logs", "Windows", "DIFR"]
---

### Convert evtx to json

{{< tab set1 tab1 >}}evtx_dump{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
./evtx_dump -o jsonl -t 1 -f Security.json Security.evtx
```

<small>*Ref: [evtx_dump](https://github.com/omerbenamram/evtx/releases)*</small>

{{< /tabcontent >}}

#### Check Number of Logs

```console
wc -l Security.json
```

### Security

#### Check Computer Name

```console
cat Security.json | jq '.Event.System.Computer' -r | sort | uniq -c | sort -nr
```

#### Overview of Event Logs

```console
cat Security.json | jq '.Event.System.EventID' | sort | uniq -c | sort -nr
```

#### Check Specific Event

```console
cat Security.json | jq 'select(.Event.System.EventID==4624)'
```
