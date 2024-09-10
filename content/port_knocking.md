---
title: "Port Knocking"
date: 2024-7-2
tags: ["port knocking", "knockd", "ssh"]
---

---
### knockd config location

<div>

```bash
# Find knock sequence
cat /etc/knockd.conf
```

</div>

<br>

---

{{< tab set1 tab1 active >}}TCP{{< /tab >}}
{{< tab set1 tab2 >}}UDP{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
# For example, sequence = 123, 456, 789
for i in 123 456 789; do nmap -Pn --host-timeout 100 --max-retries 0 -p $i 10.10.11.10 >/dev/null; done; ssh -i id_rsa <USER>@10.10.11.10
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# UDP port knocking
for i in 123 456 789; do sudo nmap -Pn -sU --host-timeout 100 --max-retries 0 -p $i 10.10.11.10 >/dev/null; done; ssh -i id_rsa <USER>@10.10.11.10
```

</div>

{{< /tabcontent >}}

<br>