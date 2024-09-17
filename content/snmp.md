---
title: "SNMP"
date: 2024-6-29
tags: ["Reconnaissance", "Enumeration", "SNMP", "Snmpwalk", "Onesixtyone", "Database Dumping"]
---

### Bruteforce commmuity string

{{< tab set1 tab1 active >}}onesixtyone{{< /tab >}}
{{< tab set1 tab2 >}}snmpbrute{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Brute force community string for snmpwalk use
onesixtyone <TARGET> -c /usr/share/doc/onesixtyone/dict.txt
```

<small>*Ref: [onesixtyone](https://github.com/trailofbits/onesixtyone)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Brute force community string (Check also SNMPv2)
python3 snmpbrute.py -t <TARGET>
```

<small>*Ref: [snmpbrute.py](https://github.com/SECFORCE/SNMP-Brute/blob/master/snmpbrute.py)*</small>

{{< /tabcontent >}}

### Tools

{{< tab set2 tab1 active >}}snmpwalk{{< /tab >}}
{{< tab set2 tab2 >}}snmpbulkwalk{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
# Install
sudo apt install snmp
```

```console
# Install Add-on for better result readability
sudo apt install snmp-mibs-downloader
```

<br>

```console
# Comment out this line in /etc/snmp/snmp.conf
# mibs :

# Uncomment this line in /etc/snmp/snmp.conf
mibdirs /usr/share/snmp/mibs:/usr/share/snmp/mibs/iana:/usr/share/snmp/mibs/ietf
```

#### Basic Commands

```console
snmpwalk -v1 -c public <TARGET> | tee snmpwalk_result
```

```console
snmpwalk -v2c -c public <TARGET> | tee snmpwalk_result
```

```console
# Query specific OID, e.g, ipAddressIfIndex.ipv6
snmpwalk -v2c -c public <TARGET> ipAddressIfIndex.ipv6
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Multithreads, much faster
snmpbulkwalk -Cr 50 -c public -v2c <TARGET>
```

{{< /tabcontent >}}
