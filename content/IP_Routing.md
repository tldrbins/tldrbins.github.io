---
title: "IP Routing"
date: 2025-7-24
tags: ["Networking", "IPRouting", "Linux", "Windows", "iproute2", "netsh", "PowerShell", "NetworkAdministration", "SystemAdministration", "Routing"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Check Routes

```console
ip route show
```

#### Add Route

```console
sudo ip route add <SUBNET> via <GATEWAY> dev <INTERFACE>
```

```console {class="sample-code"}
sudo ip route add 172.16.0.0/16 via 192.168.1.10 dev eth0
```

#### Modify Route

```console
sudo ip route replace <SUBNET> via <GATEWAY> dev <INTERFACE>
```

```console {class="sample-code"}
sudo ip route replace 172.16.0.0/16 via 192.168.1.20 dev eth0
```

#### Delete Route

```console
sudo ip route del <SUBNET>
```

```console {class="sample-code"}
sudo ip route del 172.16.0.0/16
```

```console
# Exact match
sudo ip route del <SUBNET> via <GATEWAY> dev <INTERFACE>
```

```console {class="sample-code"}
sudo ip route del 172.16.0.0/16 via 192.168.1.10 dev eth0
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}
{{< tab set1-2 tab1 active >}}cmd{{< /tab >}}{{< tab set1-2 tab2 >}}powershell{{< /tab >}}
{{< tabcontent set1-2 tab1 >}}

#### Check Routes

```console
netsh interface ipv4 show route
```

#### Add Route

```console
netsh interface ipv4 add route <SUBNET> "<INTERFACE>" <GATEWAY> store=persistent
```

```console {class="sample-code"}
netsh interface ipv4 add route 172.16.0.0/16 "Ethernet" 192.168.1.10 store=persistent
```

#### Delete Route

```console
netsh interface ipv4 delete route <SUBNET> "<INTERFACE>" <GATEWAY>
```

```console {class="sample-code"}
netsh interface ipv4 delete route 172.16.0.0/16 "Ethernet" 192.168.1.10
```

#### Flush Routes

```console
netsh interface ipv4 reset
```

{{< /tabcontent >}}
{{< tabcontent set1-2 tab2 >}}

#### Check Routes

```console
Get-NetRoute
```

#### Add Route

```console
New-NetRoute -DestinationPrefix "<SUBNET>" -NextHop "<GATEWAY>" -InterfaceAlias "<INTERFACE>" -PolicyStore PersistentStore
```

```console {class="sample-code"}
New-NetRoute -DestinationPrefix "172.16.0.0/16" -NextHop "192.168.1.10" -InterfaceAlias "Ethernet" -PolicyStore PersistentStore
```

#### Delete Route

```console
Set-NetRoute -DestinationPrefix "<SUBNET>" -NextHop "<NEW_GATEWAY>" -InterfaceAlias "<INTERFACE>"
```

```console {class="sample-code"}
Set-NetRoute -DestinationPrefix "172.16.0.0/16" -NextHop "192.168.1.20" -InterfaceAlias "Ethernet"
```

#### Flush Routes

```console
Remove-NetRoute -Confirm:$false
```

```console
# Re-add default gateway
New-NetRoute -DestinationPrefix "0.0.0.0/0" -NextHop "<GATEWAY>" -InterfaceAlias "<INTERFACE>"
```

```console {class="sample-code"}
New-NetRoute -DestinationPrefix "0.0.0.0/0" -NextHop "192.168.1.1" -InterfaceAlias "Ethernet"
```

{{< /tabcontent >}}
{{< /tabcontent >}}