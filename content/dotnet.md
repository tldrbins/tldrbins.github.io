---
title: "dotnet"
date: 2024-6-30
tags: ["Dotnet", "SDK", "C#", "Windows", "Compile", ".Net"]
---

### Compile C# project

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
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
