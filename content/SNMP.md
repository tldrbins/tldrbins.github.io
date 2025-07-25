---
title: "SNMP"
date: 2025-7-24
tags: ["Reconnaissance", "Enumeration", "SNMP", "Snmpwalk", "Onesixtyone", "Database Dumping"]
---

### Bruteforce Commmuity String

{{< tab set1 tab1 >}}onesixtyone{{< /tab >}}
{{< tab set1 tab2 >}}snmpbrute{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Brute force community string for snmpwalk use
onesixtyone <TARGET> -c /usr/share/doc/onesixtyone/dict.txt
```

```console {class="sample-code"}
$ onesixtyone 10.10.11.248 -c /usr/share/doc/onesixtyone/dict.txt
Scanning 1 hosts, 50 communities
10.10.11.248 [public] Linux monitored 5.10.0-28-amd64 #1 SMP Debian 5.10.209-2 (2024-01-31) x86_64
```

<small>*Ref: [onesixtyone](https://github.com/trailofbits/onesixtyone)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Brute force community string (Also check SNMPv2)
python3 snmpbrute.py -t <TARGET>
```

```console {class="sample-code"}
$ python3 snmpbrute.py -t 10.10.11.248
   _____ _   ____  _______     ____             __     
  / ___// | / /  |/  / __ \   / __ )_______  __/ /____ 
  \__ \/  |/ / /|_/ / /_/ /  / __  / ___/ / / / __/ _ \
 ___/ / /|  / /  / / ____/  / /_/ / /  / /_/ / /_/  __/
/____/_/ |_/_/  /_/_/      /_____/_/   \__,_/\__/\___/ 

SNMP Bruteforce & Enumeration Script v2.0
http://www.secforce.com / nikos.vassakis <at> secforce.com
###############################################################

---[SNIP]---                                                                                                                                                                       
Identified Community strings                                                                                                                                                                                        
        0) 10.10.11.248    public (v1)(RO)
        1) 10.10.11.248    public (v2c)(RO)
        2) 10.10.11.248    public (v1)(RO)
        3) 10.10.11.248    public (v2c)(RO)
Select Community to Enumerate [0]:
```

<small>*Ref: [snmpbrute.py](https://github.com/SECFORCE/SNMP-Brute/blob/master/snmpbrute.py)*</small>

{{< /tabcontent >}}

### Tools

{{< tab set2 tab1 >}}snmpwalk{{< /tab >}}
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

#### General

```console
snmpwalk -v1 -c public <TARGET> | tee snmpwalk_result
```

```console {class="sample-code"}
$ snmpwalk -v1 -c public 10.10.11.248 | tee snmpwalk_result
SNMPv2-MIB::sysDescr.0 = STRING: Linux monitored 5.10.0-28-amd64 #1 SMP Debian 5.10.209-2 (2024-01-31) x86_64
SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (33245) 0:05:32.45
SNMPv2-MIB::sysContact.0 = STRING: Me <root@monitored.htb>
SNMPv2-MIB::sysName.0 = STRING: monitored
---[SNIP]---
```

```console
snmpwalk -v2c -c public <TARGET> | tee snmpwalk_result
```

```console {class="sample-code"}
$ snmpwalk -v2c -c public 10.10.11.248 | tee snmpwalk_result
SNMPv2-MIB::sysDescr.0 = STRING: Linux monitored 5.10.0-28-amd64 #1 SMP Debian 5.10.209-2 (2024-01-31) x86_64
SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (61445) 0:10:14.45
SNMPv2-MIB::sysContact.0 = STRING: Me <root@monitored.htb>
SNMPv2-MIB::sysName.0 = STRING: monitored
---[SNIP]---
```

```console
# Query specific OID, e.g, ipAddressIfIndex.ipv6
snmpwalk -v2c -c public <TARGET> ipAddressIfIndex.ipv6
```

```console {class="sample-code"}
$ snmpwalk -v2c -c public 10.10.11.248 ipAddressIfIndex.ipv6
IP-MIB::ipAddressIfIndex.ipv6."00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:01" = INTEGER: 1
IP-MIB::ipAddressIfIndex.ipv6."fe:80:00:00:00:00:00:00:02:50:56:ff:fe:b9:b0:de" = INTEGER: 2
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
# Multithreads, much faster
snmpbulkwalk -C r10 -c public -v2c <TARGET>
```

```console {class="sample-code"}
snmpbulkwalk -C r10 -c public -v 2c 10.10.11.248
SNMPv2-MIB::sysDescr.0 = STRING: Linux monitored 5.10.0-28-amd64 #1 SMP Debian 5.10.209-2 (2024-01-31) x86_64
SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (99347) 0:16:33.47
SNMPv2-MIB::sysContact.0 = STRING: Me <root@monitored.htb>
SNMPv2-MIB::sysName.0 = STRING: monitored
---[SNIP]---
```

{{< /tabcontent >}}
