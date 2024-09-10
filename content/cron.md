---
title: "Cron Jobs"
date: 2024-7-10
tags: ["cron", "scheduled tasks", "Linux"]
---

---
{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Cron Jobs

<div>

```bash
ls -la /etc/cron.d/
```

```bash
cat /etc/crontab
```

```bash
crontab -l
```

</div>

### Check background processes

<div>

```bash
./pspy
```

</div>

<small>*Ref: [pspy](https://github.com/DominicBreuker/pspy)*</small>

{{< /tabcontent >}}

<br>
