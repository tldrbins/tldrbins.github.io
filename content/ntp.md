---
title: "NTP"
date: 2024-7-22
tags: ["ntp", "time", "network time protocol", "faketime", "ntpdate"]
---

---
### Check Server Time

<div>

```bash
sudo nmap -sU -sV --script "ntp* and (discovery or vuln) and not (dos or brute)" -p 123 10.10.11.10
```

</div>

### Check Time Skew

<div>

```bash
date; ntpdate -q 10.10.11.10
```

</div>

### Update Time

{{< tab set1 tab1 active >}}ntpdate{{< /tab >}}
{{< tab set1 tab2 >}}faketime{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Fix ntpdate from doing nothing

<div>

```bash
sudo apt install chrony
```

```bash
sudo timedatectl set-ntp true
```

```bash
sudo ntpdate -s 10.10.11.10
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
# After getting the time skew
faketime -f +9999s <COMMAND>
```

```bash
# Get from http server
faketime "$(curl -sI http://example.com | grep 'Date:' | awk -F 'Date:' '{print $2}')"
```

</div>

{{< /tabcontent >}}

<br>
