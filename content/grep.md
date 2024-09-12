---
title: "Grep"
date: 2024-7-10
tags: ["grep", "regex", "strings"]
---

#### Basic

<div>

```console
grep '<STRING>' <FILE>
```

</div>

#### Grep from files recursively (e.g from current directory)

<div>

```console
grep -rni '<STRING>' .
```

</div>

#### Grep from binary

<div>

```console
grep -a '<STRING>' <FILE>
```

</div>

#### Grep hash from binary with perl regex

<div>

```console
grep -aPo '[a-fA-F0-9]{32}' <FILE>
```

</div>

#### Grep from binaries recusively (e.g. from /var/log)

<div>

```console
sudo grep -rHa "<STRING>" /var/log
```

</div>

#### Find unique char of a file

<div>

```console
cat <FILE> | od -cvA none -w1 | sort -bu | tr -d '\n' | tr -d ' '
```

</div>

<br>
