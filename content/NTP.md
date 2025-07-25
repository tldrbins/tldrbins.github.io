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

{{< tab set1 tab1 >}}ntpdate{{< /tab >}}
{{< tab set1 tab2 >}}faketime{{< /tab >}}
{{< tab set1 tab3 >}}manual{{< /tab >}}
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
faketime "$(curl -sI <TARGET> | grep 'Date:' | awk -F 'Date:' '{print $2}')" <COMMAND>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

#### 1. Disable NTP

```console
sudo timedatectl set-ntp false
```

#### 2. Set Timezone

```console
sudo timedatectl set-timezone GMT
```

#### 3. Get Time from DC

```console
./nmap -p445 -sCV -Pn <DC>
```

```console {class="sample-code"}
sshuser@nix01:/dev/shm$ ./nmap -p445 -sCV -Pn 192.168.20.10
Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times will be slower.
Starting Nmap 7.91 ( https://nmap.org ) at 2024-11-07 16:21 UTC
Nmap scan report for 192.168.20.10
Host is up (0.00078s latency).

PORT    STATE SERVICE       VERSION
445/tcp open  microsoft-ds?

Host script results:
|_clock-skew: 6h59m07s
|_nbstat: NetBIOS name: DC, NetBIOS user: <unknown>, NetBIOS MAC: 00:50:56:b0:a7:78 (VMware)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-11-07T23:20:38
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 46.80 seconds
```

#### 4. Set Time

```console
sudo date -s '<DATE>'
``` 

```console {class="sample-code"}
$ sudo date -s '2024-11-07T23:20:38'                                                                       
Thu Nov  7 23:20:38 GMT 2024
```

{{< /tabcontent >}}