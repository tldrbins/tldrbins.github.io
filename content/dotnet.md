---
title: "dotnet"
date: 2024-6-30
tags: ["dotnet", "sdk", "c#", "c sharp", "Windows", "compile"]
---

---
### dotnet

#### Compile c# project from Linux

[Download dotnet](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)

```bash
# Check if dotnet installed
dotnet --info
```

```bash
mkdir new_project
cd new_project
dot new console

# Add dependencies if needed
dotnet add package System.XXXX.XXXX.XXXX --version 1.0.0

# Add code to Program.cs

# Run
dotnet run
```

<br>