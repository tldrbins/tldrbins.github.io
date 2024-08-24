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
onesixtyone <TARGET> -c /usr/share/doc/onesixtyone/dict.txt
```

### snmpbrute

[snmpbrute.py](https://github.com/SECFORCE/SNMP-Brute/blob/master/snmpbrute.py)

```bash
# Brute force community string (Check also SNMPv2)
python3 snmpbrute.py -t <TARGET>
```

### snmpwalk

#### Installation

```bash
sudo apt install snmp
```

```bash
# Install Add-on for better result readability
sudo apt install snmp-mibs-downloader
```

```bash
# Comment out this line in /etc/snmp/snmp.conf
# mibs :

# Uncomment this line in /etc/snmp/snmp.conf
mibdirs /usr/share/snmp/mibs:/usr/share/snmp/mibs/iana:/usr/share/snmp/mibs/ietf
```

#### Basic Commands

```bash
snmpwalk -v1 -c public <TARGET> | tee snmpwalk_result
```

```bash
snmpwalk -v2c -c public <TARGET> | tee snmpwalk_result
```

```bash
# Query specific OID, e.g, ipAddressIfIndex.ipv6
snmpwalk -v2c -c public <TARGET> ipAddressIfIndex.ipv6
```

### snmpbulkwalk (multithreads, much faster)

```bash
snmpbulkwalk -Cr 50 -c public -v2c <TARGET>
```

<br>