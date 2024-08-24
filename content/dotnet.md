---
title: "dotnet"
date: 2024-6-30
tags: ["dotnet", "sdk", "c#", "c sharp", "Windows", "compile", ".NET"]
---

---
### Compile C# project (From Linux)

[Download dotnet](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)

```bash
# Check
dotnet --info
```

```bash
# Prepare
mkdir <PROJECT_NAME>
cd <PROJECT_NAME>
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
dotnet sln <PROJECT_NAME>.sln add <PROJECT_NAME>.csproj 
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