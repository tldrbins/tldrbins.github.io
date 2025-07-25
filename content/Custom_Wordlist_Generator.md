---
title: "Custom Word List Generator"
date: 2025-7-25
tags: ["Password Cracking", "Wordlist", "Cewl", "Username"]
---

{{< tab set1 tab1 >}}CeWL{{< /tab >}}
{{< tab set1 tab2 >}}username-anarchy{{< /tab >}}
{{< tab set1 tab3 >}}spraygen{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Create custom wordlist by spidering target
cewl <TARGET> -w wordlist.txt --with-numbers
```

<small>*Ref: [CeWL](https://github.com/digininja/CeWL)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Create username wordlist
./username-anarchy -i <USERS> | tee <USERS_FILE>
```

```console {class="sample-code"}
$ username-anarchy -i users.txt | tee usernames.txt
james
jamesroberts
james.roberts
jamesrob
jamerobe
---[SNIP]---
```

<small>*Ref: [username-anarchy](https://github.com/urbanadventurer/username-anarchy)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
python3 spraygen.py --year_start <YEAR_START> --year_end <YEAR_END> --type <TYPE> -o wordlist.txt
```

```console {class="sample-code"}
$ python3 spraygen.py --year_start 2020 --year_end 2025 --type seasons -o wordlist.txt
  (  \_

     _
    (  \_
    (    \_
    (       \_  
    (         \_            ___
    ( Password   \         |   |
    (   Spray     |คคคคคคคค|___|
    (           _ /          |
    (       _ /         /~~~~~~~~~\
    (   _ /            (  Spray    )
    (_/                 |  This   |
                        |         |
                        | Get     |
                        |  Creds  |
                        |_________|

    Original Art by Alex Chudnovsky (Unaffiliated)
    Spraygen tool by 3ndG4me
    Version 1.7
    
[*] Info: Generating SEASONS list...
[*] Info: Generating seasons list |################################| 100%
[+] Success: --- generated seasons in 0.0020401477813720703 seconds ---
[*] Info: Generating separators...
[*] Info: Generating separators list |################################| 100%
[+] Success: --- separators generated in 0.0032143592834472656 seconds ---
[*] Info: Generating attributes...
[*] Info: Generating attributes list |################################| 100%
[+] Success: --- attributes generated in 0.005146980285644531 seconds ---
[*] Info: Generating attributes + separators...
[*] Info: Generating attributes + separators list |################################| 100%
[+] Success: --- attribute + separators generated in 0.01448965072631836 seconds ---
[*] Info: Adding new generated items to the list...
[*] Info: Adding relevant attribute/separator permutations to final list, this could take some time...
[*] Info: Progress |################################| 100%
[*] Info: Adding year permutations to final list |################################| 100%
[+] Success: --- initial list built in 46.739391565322876 seconds ---
[+] Success: Bulding final list!
[+] Success: Writing output to: wordlist.txt
[*] Success: Progress |################################| 100%

[+] Success: --- finished in 46.8829460144043 seconds ---
[+] Success: Done!
```

{{< /tabcontent >}}