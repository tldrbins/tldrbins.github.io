---
title: "Scheduled tasks"
date: 2024-7-10
tags: ["Enumeration", "Scheduled Tasks", "Windows", "Enum"]
---

### Check scheduled tasks

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
schtasks /query
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Administrator\Documents> schtasks /query

Folder: \
TaskName                                 Next Run Time          Status
======================================== ====================== ===============
CleanUpDownloads                         N/A                    Ready
CreateExplorerShellUnelevatedTask        N/A                    Ready
fix_vm                                   N/A                    Ready
OneDriveUpdate                           N/A                    Running
User_Feed_Synchronization-{0041D634-0AC8 9/25/2024 12:48:00 AM  Ready
User_Feed_Synchronization-{12517E1A-613E 9/24/2024 6:58:48 PM   Ready

...[SNIP]...
```

```console
# List details
schtasks /TN \<FOLDER>\<TASKNAME> /FO LIST /V
```

```console {class="sample-code"}
*Evil-WinRM* PS C:\Users\Administrator\Documents> schtasks /TN \OneDriveUpdate /FO LIST /V

Folder: \
HostName:                             DC
TaskName:                             \OneDriveUpdate
Next Run Time:                        N/A
Status:                               Running
Logon Mode:                           Interactive only
Last Run Time:                        9/24/2024 6:12:00 PM
Last Result:                          267009
Author:                               HOSPITAL\Administrator
Task To Run:                          powershell.exe -c "python.exe C:\Windows\System32\SyncAppvPublicationServer.vbs"
Start In:                             N/A
Comment:                              N/A
Scheduled Task State:                 Enabled
Idle Time:                            Disabled
Power Management:                     Stop On Battery Mode
Run As User:                          drbrown
Delete Task If Not Rescheduled:       Disabled
Stop Task If Runs X Hours and X Mins: Disabled
Schedule:                             Scheduling data is not available in this format.
Schedule Type:                        At logon time
Start Time:                           N/A
Start Date:                           N/A
End Date:                             N/A
Days:                                 N/A
Months:                               N/A
Repeat: Every:                        N/A
Repeat: Until: Time:                  N/A
Repeat: Until: Duration:              N/A
Repeat: Stop If Still Running:        N/A
```

{{< /tabcontent >}}
