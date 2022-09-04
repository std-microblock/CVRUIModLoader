using MelonLoader;
using System;
using UnityEngine;
using ABI_RC.Helpers;
using HarmonyLib;
using ABI.CCK.Components;
using ABI_RC.Core.InteractionSystem;
using CVRUIModLoader;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace microblock
{

    public class CVRUIModLoader : MelonMod
    {
        private const string UIMOD_EXTRACT_DIR = "ChilloutVR_Data/StreamingAssets/Cohtml/UIResources/UIMods";
        private const string UIMOD_USER_DIR = "UIMods";

        public override void OnApplicationStart()
        {
            LoggerInstance.Msg("Hooking To ViewManager.UiStateToggle ...");
            LoggerInstance.Msg("This path" + System.Reflection.Assembly.GetExecutingAssembly().Location);


            Directory.CreateDirectory(UIMOD_EXTRACT_DIR);

            var existedMods = Directory.EnumerateDirectories(UIMOD_EXTRACT_DIR);
            foreach (var mod in existedMods)
            {
                LoggerInstance.Msg(mod);
                if (mod.EndsWith(".uimod"))
                {
                    Directory.Delete(mod, true);
                }
            }

            Directory.CreateDirectory(UIMOD_USER_DIR);
            var mods = Directory.EnumerateFiles(UIMOD_USER_DIR);

            var loadedMods = new List<string>();
            foreach (var mod in mods)
            {
                if (mod.EndsWith(".uimod"))
                {
                    try
                    {
                        string modName = mod.Split('\\', '/')[1];
                        string extractPath = UIMOD_EXTRACT_DIR + "/" + modName;

                        Directory.CreateDirectory(extractPath);
                        System.IO.Compression.ZipFile.ExtractToDirectory(mod, extractPath);
                        loadedMods.Add(modName);
                    }
                    catch (Exception e)
                    {
                        LoggerInstance.Error($"Failed to load UI Mod -> {mod}: {e}");
                    }
                }
            }

            File.WriteAllText($"{UIMOD_EXTRACT_DIR}/mods.json", JsonConvert.SerializeObject(loadedMods));

            LoggerInstance.Msg("Patches Applied!");
        }



        [HarmonyPatch(typeof(ViewManager), "UiStateToggle", new Type[] { })]
        public static class Patch
        {
            public static void Postfix(ViewManager __instance)
            {
                __instance.gameMenuView.View.ExecuteScript(Resource.fetch_min);
                __instance.gameMenuView.View.ExecuteScript(Resource.mui_loader);
            }
        }
    }
}
