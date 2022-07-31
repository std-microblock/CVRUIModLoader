# CVRUIModLoader

A tempory loader for UI Mods of ChilloutVR

ChilloutVR UI Mods 的加载器

![image](https://user-images.githubusercontent.com/66859419/182022797-65f99eee-13be-4822-bd59-3cbb38b45a85.png)
![image](https://user-images.githubusercontent.com/66859419/182022831-2eb5a8e6-9f56-4451-aef2-b1eed9fcaee7.png)

# Usage

First, install [MelonLoader](https://melonwiki.xyz/)

You can either use [CVRMelonAssistant](https://github.com/knah/CVRMelonAssistant/releases/latest/download/CVRMelonAssistant.exe) to install it or use ways mentioned in [MenlonLoader Wiki](https://melonwiki.xyz/#/?id=automated-installation)

Then, download the .dll file of CVRUIModLoader, put it in the `ChilloutVR\Mods` folder

Put the ui mods you want to install to the `ChilloutVR\UIMods` folder:
![image](https://user-images.githubusercontent.com/66859419/182023503-04095177-ac37-44cb-9d7b-c2af4e9471f0.png)

Restart the game and enjoy!

# Develop

> Tip: You can open the tiny debugger of CVRUIModLoader by clicking rapidly for several times

Every mod is a folder in `ChilloutVR\ChilloutVR_Data\StreamingAssets\Cohtml\UIResources\UIMods`

To create a mod, you need to create a folder there and add the name of your folder to `ChilloutVR\ChilloutVR_Data\StreamingAssets\Cohtml\UIResources\UIMods\mods.json` 

The next step is to create `mod.json` inside the folder.

The main file of a UI Mod is the json, here's an example of it.
```json
{
    "name":"CyanTheme",
    "version":"0.1.0",
    "author":"MicroBlock",
    "injects":{
        "MainMenu":{
            "files":["mainmenu.css","mainmenu.js"],
            "liveReload":false
        }
    }
}
```
It defines the version, name, author and injects of the mod.

The key of `injects` defines where to inject the files.(Now supported: `MainMenu`)

The value of `injects` defines the files to inject and whether live reload or not.

The method to inject depends on the suffix of the file.(Now supported `.js`,`.css`)
