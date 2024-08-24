---
title: "Port Knocking"
date: 2024-7-2
tags: ["port knocking", "knockd", "ssh"]
---

---
### knockd

```bash
# Find knock sequence
cat /etc/knockd.conf
```

```bash
# For example, sequence = 123, 456, 789
for i in 123 456 789; do nmap -Pn --host-timeout 100 --max-retries 0 -p $i 10.10.11.10 >/dev/null; done; ssh -i id_rsa <USER>@10.10.11.10
```

```bash
# UDP port knocking
for i in 123 456 789; do sudo nmap -Pn -sU --host-timeout 100 --max-retries 0 -p $i 10.10.11.10 >/dev/null; done; ssh -i id_rsa <USER>@10.10.11.10
```

<br>