---
title: "Windows Event Logs"
date: 2024-8-27
tags: ["evtx", "event logs", "forensics", "Windows", "DIFR"]
---

---
### Convert evtx to json

{{< tab set1 tab1 active >}}evtx_dump{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
./evtx_dump -o jsonl -t 1 -f Security.json Security.evtx
```

</div>

<small>*Ref: [evtx_dump](https://github.com/omerbenamram/evtx/releases)*</small>

{{< /tabcontent >}}

#### Check number of logs

<div>

```bash
wc -l Security.json
```

</div>

### Security

#### Check computer name

<div>

```bash
cat Security.json | jq '.Event.System.Computer' -r | sort | uniq -c | sort -nr
```

</div>

#### Overview of event logs

<div>

```bash
cat Security.json | jq '.Event.System.EventID' | sort | uniq -c | sort -nr
```

</div>

#### Check specific event

<div>

```bash
cat Security.json | jq 'select(.Event.System.EventID==4624)'
```

</div>

<br>