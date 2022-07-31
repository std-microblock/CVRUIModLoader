using MelonLoader;
using System;
using UnityEngine;
using ABI_RC.Helpers;
using HarmonyLib;
using ABI.CCK.Components;
using ABI_RC.Core.InteractionSystem;



namespace microblock
{
    
    public class CVRUIModLoader : MelonMod
    {
        public static HarmonyLib.Harmony MyHarmony = new HarmonyLib.Harmony("cc.microblock.CVRUIModLoader");

        public override void OnApplicationStart()
        {
            LoggerInstance.Msg("Hooking To ViewManager.UiStateToggle ...");
            MyHarmony.PatchAll();
            LoggerInstance.Msg("Patches Applied!");
        }

       

        [HarmonyPatch(typeof(ViewManager), "markMenuAsReady", new Type[] {  })]
        public static class Patch
        {
            public static void Postfix(ViewManager __instance)
            {
                MelonDebug.Msg("Called");
                __instance.gameMenuView.View.ExecuteScript(CVRUIModLoader.Resource.fetch_min);
                __instance.gameMenuView.View.ExecuteScript(CVRUIModLoader.Resource.mui_loader);
                //__instance.gameMenuView.View.Reload();
            }
        }
    }
}
