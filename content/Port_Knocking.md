---
title: "Port Knocking"
date: 2025-7-25
tags: ["Port Knocking", "Knockd", "Ssh", "Authentication"]
---

### knockd Config Location

```console
# Find knock sequence
cat /etc/knockd.conf
```

---

{{< tab set1 tab1 >}}TCP{{< /tab >}}
{{< tab set1 tab2 >}}UDP{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# For example, sequence = 123, 456, 789
for i in 123 456 789; do nmap -Pn --host-timeout 100 --max-retries 0 -p $i <TARGET> >/dev/null; done; ssh -i id_rsa <USER>@<TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# UDP port knocking
for i in 123 456 789; do sudo nmap -Pn -sU --host-timeout 100 --max-retries 0 -p $i <TARGET> >/dev/null; done; ssh -i id_rsa <USER>@<TARGET>
```

{{< /tabcontent >}}
