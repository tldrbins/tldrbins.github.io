---
title: "SNMP"
date: 2024-6-29
tags: ["snmp", "reconnaissance", "enum", "snmpwalk", "udp", "onesixtyone"]
---

---
### onesixtyone

[Download onesixtyone](https://github.com/trailofbits/onesixtyone)

```bash
# Brute force community string for snmpwalk use
onesixtyone 10.10.11.10 -c /usr/share/doc/onesixtyone/dict.txt
```

### snmpwalk

#### Installation

```bash
sudo apt install snmp

# Install Add-on for better result readability
sudo apt install snmp-mibs-downloader

# Comment out this line in /etc/snmp/snmp.conf
# mibs :

# Uncomment this line in /etc/snmp/snmp.conf
mibdirs /usr/share/snmp/mibs:/usr/share/snmp/mibs/iana:/usr/share/snmp/mibs/ietf
```

#### Basic Commands

```bash
snmpwalk -v2c -c public 10.10.11.10 | tee snmpwalk_result

# Query specific OID, e.g, ipAddressIfIndex.ipv6
snmpwalk -v2c -c public 10.10.11.10 ipAddressIfIndex.ipv6
```

<br>