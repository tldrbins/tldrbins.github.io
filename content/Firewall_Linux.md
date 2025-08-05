---
title: "Firewall (Linux)"
date: 2025-7-17
tags: ["Firewall", "Inbound", "Outbound", "Network", "Linux", "Access Control", "Iptables"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

### Check Firewall Rules

```console
# Show all rules
sudo iptables -L -v -n --line-numbers
```

```console
# Show target chain
sudo iptables -L <CHAIN> -v -n --line-numbers
```

```console {class="sample-code"}
sudo iptables -L INPUT -v -n --line-numbers
```

---

### Set Firewall Rules

```console
# Default policy
sudo iptables -P <CHAIN> <RULE>
```

```console {class="sample-code"}
sudo iptables -P INPUT DROP
```

```console
sudo iptables -A <CHAIN> -p <PROTOCOL> -s <SOURCE> --dport <PORT> -j <RULE>
```

```console {class="sample-code"}
# Allow SSH from a specific subnet
sudo iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT
```

---

### Delete a Firewall Rule

```console
sudo iptables -D <CHAIN> <LINE_NUMBER>
```

```console {class="sample-code"}
sudo iptables -D INPUT 1
```

{{< /tabcontent >}}
