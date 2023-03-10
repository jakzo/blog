---
icon: 🧰
title: Modding Unity IL2CPP Games
date: 2023-03-10
excerpt: Step-by-step guide to reverse-engineer and build mods for IL2CPP Unity games.
---

Since my [last post](./reverse-engineering-a-unity-game) I've had time to find better ways to do things. This is a step-by-step guide to how I write mods today. Note that there's a focus here on IL2CPP (because most of the games I've made mods for use this) but most of this guide is still relevant for non-IL2CPP mods.

{% toc %}

## 🤖 Choose a modding framework

There are two major modding frameworks for IL2CPP:

- BepInEx
- MelonLoader

For most games you can choose either and they work very similarly, although generally a modding community for a game will have a preferred one. In my experience BepInEx is older, more popular and is slightly more compatible/stable, but MelonLoader is still good and is slightly more convenient in some ways.

## 📒 Set up repository

Setting up code is always a bit of a hassle. I like to do most of my development on a MacBook so using `dotnet` doesn't work (which most guides recommend). I've made a custom setup which I just copy-paste for new projects. It's not perfect and there's a lot of improvements that could be made but I've automated most of the common tasks (eg. creating a new mod, publishing to Thunderstore).

- Example for MelonLoader: [SlzSpeedrunTools](https://github.com/jakzo/SlzSpeedrunTools)
- Example for BepInEx: [EndnightMods](https://github.com/jakzo/EndnightMods)

Features of these setups are:

- Create a new mod with a single command:
  ```sh
  csi ./scripts/CreateNewProject.csx "game" "ProjectName" "Description of project."
  ```
- Mod source code can be added to a `common` folder and shared between multiple mods.
- GitHub actions to automatically create dev builds (good for sharing with testers) and to release new versions of mods and publish to Thunderstore.
- Development can be done on Windows, Mac or any OS with a browser (eg. Android) through Gitpod.

For a new game I will just:

- Copy one of these repositories
- Delete everything in `projects`
- Delete everything in `common` except for `metadata.cs` and the logger
- Replace any references to the old game with the new one
- Replace files in the `references` directory with ones from the new game
  - Run the game with the mod framework installed to generate these inside the game directory
- Set up GitHub actions including adding the `THUNDERSTORE_API_KEY` environment variable

Although I'm trying to move to having one repository for all my mods so I don't need to do this every time.

## 🛠️ Reverse engineering

You can explore the classes and methods that exist in the via auto-complete/go-to-definition in your IDE. You may prefer to use [DnSpy](https://github.com/dnSpy/dnSpy) for this though.

1. Download [Cpp2IL](https://github.com/SamboyCoding/Cpp2IL)
1. Decompile game:
   ```powershell
   .\\Cpp2IL.exe "${GAME_FOLDER}" --just-give-me-dlls-asap-dammit
   ```
   This will generate decompiled DLLs in `cpp2il_out`.
1. Download [DnSpy](https://github.com/dnSpy/dnSpy)
1. Run then: Open -> Select all the `.dll` files in `cpp2il_out`

This will let you search through the classes and methods available in the game. It also tries to decompile the source code, though usually fails and is not completely accurate but can be useful. There is also a newer version of the tool which will add attributes to methods showing which methods call them.

To more accurately read the logic of game code you will need to decompile the x86 instructions:

1. Download [Il2CppDumper](https://github.com/Perfare/Il2CppDumper/releases)
1. Extract game info:
   ```powershell
   .\\Il2CppDumper.exe "${GAME_FOLDER}\\${GAME_NAME}.exe" "${GAME_FOLDER}\\${GAME_NAME}_Data\\il2cpp_data\\Metadata\\global-metadata.dat" ".\\${GAME_NAME}"
   ```
1. Download [Ghidra](https://github.com/NationalSecurityAgency/ghidra/releases)
1. Run Ghidra then:
   1. Create a new project: File -> New Project -> Non-Shared Project -> Select directory and choose project name
   1. Load game binary: File -> Import -> Select `GameAssembly-CSharp.dll` from the game directory -> Open it (double click)
   1. Analyse: Say "yes" to the prompt to analyse the game (or go to Analysis -> Auto analyze) -> Keep defaults (most selected except for prototype features) -> Start analysis and wait for a long time (hours)
   1. Add struct info: File -> Parse C Source -> `+` -> Select the `il2cpp.h` file that Il2CppDumper generated in the previous step -> Parse to Program -> After that finishes, dismiss
   1. Rename methods: Window -> Script manager -> Manage script directories (list icon in top-right) -> Select the Il2CppDumper directory that contains `ghidra_with_struct.py` -> Find `ghidra_with_struct.py` in the list and run it (double-click) -> Select the `script.json` file that Il2CppDumper generated when prompted -> Wait until it's done

After these steps you can type the name of a method in the filter on the left, then click on the method and it will show its assembly and decompiled C++ code on the right. Note that the decompiled output is still not completely accurate. Sometimes you need to look at the assembly to get the exact logic (particularly around position/rotation code where a whole `Vector3` or `Quaternion` is loaded into an `XMM` register).

There are some common patterns you will see in the decompiled code. You can also manually clean up some of things in Ghidra by renaming labels and such. Some of these patterns are:

- A lot of functions will end in a `FUN_xyz();` followed by `swi()` (unknown instruction). This generally indicates a thrown exception. You can right click on the `FUN_xyz()` call -> Edit function signature -> Rename to `ThrowException` and select "no return". This will make all thrown exceptions be named now and remove the `swi()` after these calls.
- Comparisons with `null`, `false` or `0` can take a few different shapes in the decompiled output:
  ```c++
  if (someVar == 0) {}
  if (someVar == '\x00') {}
  if (someVar == (Namespace_ClassName_o *)0x0) {}
  ```
- C# inserts a lot of extra code like checking for null values before performing any operation or asserting that it's the right type.
- Reflection can have issues with labelling and sometimes you need to manually check or guess what it's referring to. You can use [UnityExplorer](https://github.com/sinai-dev/UnityExplorer) to validate what value fields actually have at runtime.

There are many other things and a lot of the time you will need to figure out what some code actually means yourself.

## 📄 Conclusion

That's basically what I do off the top of my head. There's plenty more to write but I might update this post later if I feel like it. Hope it helps. Good luck!
