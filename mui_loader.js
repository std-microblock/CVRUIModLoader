(function () {

    if(!window["MUI_LOADED"]){
        window["MUI_LOADED"]=true;
        loader()
    }

    async function loader() {
        const MUI_LOADER_ROOT = "coui://uiresources/UIMods/"

        const ChilloutInjectMap = {
            "coui://uiresources/CVRTest/index.html": "MainMenu"
        }

        function loadRemoteJS(url) {
            return new Promise((rs, rj) => {
                let script = document.createElement("script")
                script.src = url
                script.onload = rs
                script.onabort = rj
                script.onerror = rj
                document.querySelector("head").appendChild(script)
            })
        }

        function loadRemoteCSS(url) {
            return new Promise((rs, rj) => {
                let link = document.createElement("link")
                link.rel = "stylesheet"
                link.src = url
                link.onload = rs
                link.onabort = rj
                link.onerror = rj
                document.querySelector("head").appendChild(link)
            })
        }

        function loadCSS(stylesheet, identifier = "") {
            if (identifier && document.getElementById(identifier + "_CSS")) {
                document.getElementById(identifier + "_CSS").innerHTML = stylesheet;
                return;
            }

            let link = document.createElement("style")
            link.innerHTML = stylesheet
            if (identifier)
                link.id = identifier + "_CSS"
            document.querySelector("head").appendChild(link)
        }

        function loadJS(js, identifier = "") {
            let script = document.createElement("script")
            script.innerHTML = js
            if (identifier)
                script.id = identifier + "_CSS"
            document.querySelector("head").appendChild(script)
        }

        function loadModAsset(path, content, id = "") {
            if (path.endsWith(".css")) return loadCSS(content, id);
            if (path.endsWith(".js")) return loadJS(content, id);
        }


        let $ = (...e) => { return document.querySelector(...e) }, $$ = (...e) => { return document.querySelectorAll(...e) }

        // dom create tool
        function dom(tag, settings, ...children) {
            let tmp = document.createElement(tag);
            if (settings.class) {
                for (let cl of settings.class) {
                    tmp.classList.add(cl)
                }
                delete settings.class
            }

            if (settings.style) {
                for (let cl in settings.style) {
                    tmp.style[cl] = settings.style[cl]
                }
                delete settings.style
            }

            for (let v in settings) {
                tmp[v] = settings[v];
            }

            for (let child of children) {
                tmp.appendChild(child)
            }
            return tmp
        }



        async function loadMods(url) {
            let mods = await (await fetch(url + "/mods.json")).json()

            let guiType = ChilloutInjectMap[location.href]
            console.log(`GuiType: ${guiType}`);
            if (!guiType) return;

            if (guiType === "MainMenu") {
                try {
                    $("#settings .list-content").appendChild(dom("div", { id: "settings-modding-ui", class: ["settings-categorie"], style: { padding: ".5rem", background: "transparent" } }, dom("h2", { innerHTML: "UI Mods Settings" })))
                    $("#settings .filter-content").appendChild(dom("div", { class: ["filter-option"], onclick: function () { switchSettingCategorie('settings-modding-ui', this) }, innerHTML: "UI Mods" }))
                    window.dom = dom
                    window.muiSettingsDom = $("#settings-modding-ui")
                } catch (e) {
                    console.log(e.toString())
                }
            }

            muiSettingsDom.appendChild(dom("h3", { innerHTML: "Loaded Mods" }))

            for (let modName of mods) {
                let modInfo = await (await fetch(url + "/" + modName + "/mod.json")).json();

                muiSettingsDom.appendChild(dom("div", { innerHTML: modName, style: { marginLeft: ".7rem", fontSize: "larger" } }))

                let modInjects = modInfo.injects && modInfo.injects[guiType];
                if (modInjects) {
                    if (modInfo.injects[guiType].file) modInfo.injects[guiType].files = [modInfo.injects[guiType].file]
                    for (let file of modInfo.injects[guiType].files) {
                        let last = await (await fetch(url + "/" + modName + "/" + file)).text()
                        if (modInjects.liveReload) {
                            setInterval(async () => {
                                let now = await (await fetch(url + "/" + modName + "/" + file)).text();
                                if (last !== now) {
                                    last = now;
                                    // loadCSS(now, modName)
                                    location.reload()
                                    console.log(`Reloading mod stylesheet ${modName} ${file}`)
                                }
                            }, 500)

                            muiSettingsDom.appendChild(dom("div", { innerHTML: `${file} [LiveReload]`, style: { marginLeft: "1.5rem" } }))
                        } else {
                            muiSettingsDom.appendChild(dom("div", { innerHTML: `${file}`, style: { marginLeft: "1.5rem" } }))
                        }
                        loadModAsset(file, last, modName)
                        console.log(`Loading mod stylesheet ${modName} ${file}`)
                    }
                }
            }

            return mods
        }

        function buildMuiDebuggingGUI() {
            if (!console.log.toString().includes("[native code]")) return;
            let _log = console.log;
            console.log = (...args) => {
                _log(...args);
                let log = document.createElement('div')

                log.style.fontSize = "20px"
                log.style.background = "white"
                log.innerHTML = args.join("<br>")

                document.getElementById("mui_controls").appendChild(log)
            }

            let muiCtrl = document.createElement("div");

            muiCtrl.id = "mui_controls"

            let evalInput = document.createElement("input")

            evalInput.id = "INP"
            evalInput.style.float = "left"
            evalInput.style.fontSize = "25px";
            evalInput.style.fontWeight = "800";
            evalInput.style.width = "100%"


            muiCtrl.style.width = "300px";
            muiCtrl.style.height = "600px";

            muiCtrl.style.position = "absolute"

            let btnReload = document.createElement("button")
            btnReload.onclick = () => {
                window.location.reload(true);
            }
            btnReload.innerHTML = "Reload"

            let btnHide = document.createElement("button")
            btnHide.onclick = () => {
                document.getElementById("mui_controls").style.display = "none"
            }
            btnHide.innerHTML = "Hide"

            muiCtrl.appendChild(evalInput)
            muiCtrl.appendChild(btnReload)
            muiCtrl.appendChild(btnHide)

            document.querySelector("*").appendChild(muiCtrl);


            document.querySelector("#INP").onkeydown = async (event) => {
                if (event.keyCode == 13) {
                    let script = evalInput.value
                    evalInput.value = ""

                    try {
                        if (script.includes("return") || script.startsWith("var") || script.startsWith("let"))
                            console.log(await eval(`(async ()=>{${script}})()`))
                        else
                            console.log(await eval(`(async ()=>{return ${script}})()`))
                    } catch (e) {
                        try {
                            await eval(script)
                        } catch (_) {
                            console.log("Error:", e)
                            return;
                        }
                        console.log("Run directly no log")
                    }
                }
            }

            document.getElementById("mui_controls").style.display = "none"

            let count = 0;
            window.addEventListener("click", (e) => {
                count++
                if (count == 5) {
                    document.getElementById("mui_controls").style.display = "block"
                    document.getElementById("mui_controls").style.left = e.screenX + "px"
                    document.getElementById("mui_controls").style.top = e.screenY + "px"
                    count = 0
                }
            })

            setInterval(() => {
                if (count > 0)
                    count--
            }, 400)
        }

        buildMuiDebuggingGUI()


        let mods = await loadMods(MUI_LOADER_ROOT);
        console.log(`Successfully loaded mods (${mods.length})`)
    }
})()