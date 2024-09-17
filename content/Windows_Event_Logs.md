---
title: "Windows Event Logs"
date: 2024-8-27
tags: ["Forensics", "Evtx", "Event Logs", "Windows", "DIFR"]
---

### Convert evtx to json

{{< tab set1 tab1 active >}}evtx_dump{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
./evtx_dump -o jsonl -t 1 -f Security.json Security.evtx
```

<small>*Ref: [evtx_dump](https://github.com/omerbenamram/evtx/releases)*</small>

{{< /tabcontent >}}

#### Check number of logs

```console
wc -l Security.json
```

### Security

#### Check computer name

```console
cat Security.json | jq '.Event.System.Computer' -r | sort | uniq -c | sort -nr
```

#### Overview of event logs

```console
cat Security.json | jq '.Event.System.EventID' | sort | uniq -c | sort -nr
```

#### Check specific event

```console
cat Security.json | jq 'select(.Event.System.EventID==4624)'
```
