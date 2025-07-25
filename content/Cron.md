---
title: "Cron Jobs"
date: 2025-7-25
tags: ["Cron", "Scheduled Tasks", "Linux"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Cron Jobs

```console
ls -la /etc/cron.d/
```

```console
cat /etc/crontab
```

```console
crontab -l
```

### Check Background Processes

```console
./pspy64
```

<small>*Ref: [pspy64](https://github.com/DominicBreuker/pspy)*</small>

{{< /tabcontent >}}
