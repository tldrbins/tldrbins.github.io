---
title: "Dotnet"
date: 2025-7-25
tags: ["Dotnet", "SDK", "C#", "Windows", "Compile", ".Net", "Programming"]
---

### Compile C# Project

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Check
dotnet --info
```

```console
# Prepare
mkdir <PROJECT_NAME>
cd <PROJECT_NAME>
```

```console
# Init
dotnet new console
```

```console
# Create .sln file
dotnet new sln
```

```console
# Link .sln to .csproj
dotnet sln <PROJECT_NAME>.sln add <PROJECT_NAME>.csproj 
```

```console
# Add dependencies (optional)
dotnet add package System.XXXX.XXXX.XXXX --version 1.0.0
```

```
+----------------------+
|Add Code to Program.cs|
+----------------------+
```

```console
# Build solution
dotnet build -c Release
```

```console
# Run
dotnet run
```

<small>*Ref: [dotnet](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)*</small>

{{< /tabcontent >}}
