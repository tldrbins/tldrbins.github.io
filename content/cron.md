---
title: "Cron Jobs"
date: 2024-7-10
tags: ["cron", "scheduled tasks", "Linux"]
---

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
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

### Check background processes

```console
./pspy
```

<small>*Ref: [pspy](https://github.com/DominicBreuker/pspy)*</small>

{{< /tabcontent >}}
