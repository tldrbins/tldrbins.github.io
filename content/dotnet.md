---
title: "dotnet"
date: 2024-6-30
tags: ["dotnet", "sdk", "c#", "c sharp", "Windows", "compile", ".NET"]
---

---
### Compile c# project from Linux

[Download dotnet](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)

```bash
# Check
dotnet --info
```

```bash
# Prepare
mkdir new_project
cd new_project
```

```bash
# Init
dotnet new console
```

```bash
# Create .sln file
dotnet new sln
```

```bash
# Link .sln to .csproj
dotnet sln new_project.sln add new_project.csproj 
```

```bash
# Add dependencies (optional)
dotnet add package System.XXXX.XXXX.XXXX --version 1.0.0
```

```
+----------------------+
|Add Code to Program.cs|
+----------------------+
```

```bash
# Build solution
dotnet build
```

```bash
# Run
dotnet run
```

<br>