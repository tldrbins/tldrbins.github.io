---
title: "NTP"
date: 2024-7-22
tags: ["NTP", "Time", "Network Time Protocol", "Faketime", "Ntpdate"]
---

### Check Server Time

```console
sudo nmap -sU -sV --script "ntp* and (discovery or vuln) and not (dos or brute)" -p 123 <TARGET>
```

### Check Time Skew

```console
date; ntpdate -q <TARGET>
```

### Update Time

{{< tab set1 tab1 active >}}ntpdate{{< /tab >}}
{{< tab set1 tab2 >}}faketime{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Fix ntpdate from doing nothing

```console
sudo apt install chrony
```

```console
sudo timedatectl set-ntp true
```

```console
sudo ntpdate -s <TARGET>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# After getting the time skew
faketime -f <TIME_DIFF> <COMMAND>
```

```console
# Get from http server
faketime "$(curl -sI <TARGET> | grep 'Date:' | awk -F 'Date:' '{print $2}')"
```

{{< /tabcontent >}}
