---
title: "dotnet"
date: 2024-6-30
tags: ["dotnet", "sdk", "c#", "c sharp", "Windows", "compile", ".NET"]
---

---
### Compile C# project

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

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
dotnet build -c Release
```

```bash
# Run
dotnet run
```

</div>

<small>*Ref: [dotnet](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)*</small>

{{< /tabcontent >}}

<br>