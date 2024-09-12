---
title: "NTP"
date: 2024-7-22
tags: ["ntp", "time", "network time protocol", "faketime", "ntpdate"]
---

### Check Server Time

<div>

```console
sudo nmap -sU -sV --script "ntp* and (discovery or vuln) and not (dos or brute)" -p 123 <TARGET>
```

</div>

### Check Time Skew

<div>

```console
date; ntpdate -q <TARGET>
```

</div>

### Update Time

{{< tab set1 tab1 active >}}ntpdate{{< /tab >}}
{{< tab set1 tab2 >}}faketime{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Fix ntpdate from doing nothing

<div>

```console
sudo apt install chrony
```

```console
sudo timedatectl set-ntp true
```

```console
sudo ntpdate -s <TARGET>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
# After getting the time skew
faketime -f +9999s <COMMAND>
```

```console
# Get from http server
faketime "$(curl -sI http://<DOMAIN> | grep 'Date:' | awk -F 'Date:' '{print $2}')"
```

</div>

{{< /tabcontent >}}

<br>
