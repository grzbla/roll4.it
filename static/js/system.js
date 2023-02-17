// imports
import {uuid, path, style} from "./modules/base.js"

// third party imports
import fs from "../lib/indexed.filesystem.js"
import browserDetect from "../lib/browser-detect.es5.js"

{ //make b go out of scope fast
    let b = browserDetect()
    window.browser =
    {
        platform: b.mobile ? "mobile" : "embedded",
        name: b.name,
        system: b.os,
        version: b.version,
        versionNumber: b.versionNumber,
    }
}

function get(selector)
{
    return document.querySelector(selector)
}

function RPG()
{
    this.fileDelay = 100

    /*
        substitute disallowedChars found in string with replacement
    */
    this.replacer = (string, disallowedChars, replacement) =>
    {
        for (let i = 0, l = disallowedChars.length; i < l; i++)
        {
            const char = disallowedChars.charAt(i)

            string = string.replaceAll(char, replacement)
        }
        return string
    }
    /*
        remove unwanted chars from string
    */
    this.sanitize = (string) =>
    {
        string = this.replacer(string, this.ui.dnd.disallowedChars.remove, "")
        string = this.replacer(string, this.ui.dnd.disallowedChars.underscore, "_")
        return string
    }

    this.user =
    {

    }

    this.network =
    {

    }

    this.ui =
    {
        gridWidth: 10,
        gridHeight: 6,
        click: (event) =>
        {
            const rect = event.target.getBoundingClientRect()
            const x = event.clientX - rect.left, y = event.clientY - rect.top
            const height = event.target.offsetHeight, width = event.target.offsetWidth

            console.log(x, width, y, height)
            console.log(width - x, width * 0.5)
            const right = (width - x) < (width * 0.5)
            const top = (height - y) > (height * 0.5)

            //todo select closest side
            let effect;
            if (right)
            {
                effect = "click-effect-right"
            }
            else if (top)
            {
                effect = "click-effect-top"
            }
            else if (!right && !top)
            {
                effect = "click-effect-left"
            }
            else
            {
                effect = "click-effect-bottom"
            }
            event.target.classList.add(effect)
            setTimeout((target) =>
            {
                target.classList.remove(effect)
            }, 100, event.target)



        },
        // drag and drop1
        dnd:
        {
            //disallowed file name char list
            disallowedChars:
            {
                remove: "\\*?!\"'|()[]{}<>+`",
                underscore: ": ",
            },
            drag: (event) => // prevent default on drag
            {
                event.preventDefault()
            },
            drop: (event) => //get files on drop
            {
                event.preventDefault()
                this.ui.dnd.getFiles(event)
            },
            saveFile: (item, path, event) => //saves item as blob to path
            {
                // Get file
                item.file((file) =>
                {
                    file.arrayBuffer().then((arrayBuffer) =>
                    {
                        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
                        const splat = file.name.split(".")

                        //create file object
                        const f = { name: this.sanitize(file.name), extension: ((splat.length > 1) ? splat.pop() : null), data: blob, type: file.type != "" ? file.type : null, size: file.size }
                        this.ui.dnd.writeFile(f, path, event)
                    });
                });
            },
            writeFile: async (file, path, event) => // writes f to path
            {
                //indexeddb-fs allows only limited char set
                //TODO this sucks, change indexeddb-fs to something else
                const pathSanitized = this.sanitize(path)
                path = pathSanitized.slice(0, -1) + "/" + file.name

                await fs.writeFile(path, file)

                //produce strings
                let dir = path.split("/")
                let filename = dir.pop()
                const statsPath = dir.join("/") + "/stats.json"

                //delay each file write a little bit

                //stats file for faster file size calculation
                let stats = {};
                if (await fs.exists(statsPath)) //if stats.json exists, read it
                    stats = await fs.readFile(statsPath)

                if (!stats[file.name])
                    stats[file.name] = {}

                file.size = (file.size * 0.0009765625 * 0.0009765625).toFixed(3)
                stats[file.name].size = file.size
                await fs.writeFile(statsPath, stats)

                console.log("%c" + path + ", " + (file.size) + "MiB", style.color3a)


            },
            readDroppedFiles: async (item, path, dropPath) => // reads files at current path recursively
            {
                this.fileDelayTick = 1
                path = path || "";

                // iterate directory if directory
                if (item.isDirectory)
                {
                    const name = this.sanitize(item.name)
                    const p = dropPath + "/" + path + name

                    if (dropPath == "home")
                    {

                    }
                    //if path is currently displayed or home
                    //add icons to current view
                    // if ()


                    if (!(await fs.exists(p)))
                        await fs.createDirectory(p)

                    var dirReader = item.createReader();
                    dirReader.readEntries((entries) =>
                    {
                        for (var i = 0; i < entries.length; i++)
                        {
                            this.ui.dnd.readDroppedFiles(entries[i], path + name + "/", dropPath)
                        }
                    })
                }
                else if (item.isFile)//save file if file
                {
                    this.ui.dnd.saveFile(item, dropPath + "/" + path)
                }
            },
            getFiles: (event) => // gets files from data transfer
            {
                const dropPath = event.target.getAttribute("system-path")

                const items = event.dataTransfer.items;
                for (var i = 0; i < items.length; i++)
                {
                    var item = items[i].webkitGetAsEntry();
                    if (item)
                    {
                        this.ui.dnd.readDroppedFiles(item, null, dropPath, event)
                    }
                }
            }

        },
    }

    /*
        INIT FUNCTIONS
    */
    this.init =
    {
        /*
            STARTING SEQUENCE BEGINS here
        */
        begin: async () =>
        {
            /* USER, CLIENT AND INSTANCE DATA */
            let user, client;
            if(!(await fs.exists(path.user)))
            {
                console.log("%cFresh start.", style.color2a)
                console.log("%cUser and client IDs need to be created.", style.color2a)
                user =
                {
                    id: uuid(4)
                }
                client =
                {
                    id: uuid(3),
                    browser: browser
                }

                fs.writeFile(path.user, user)
                fs.writeFile(path.client, user)
            }

            console.log("%cInstance ID needs to be created.", style.color2a)
            this.instance =
            {
                id: uuid(3)
            }
            console.log("%cInstance ID: " + JSON.stringify(this.instance, null, 2), style.color2b)


            /*
                HOME SCREEN INITIALIZATION
            */
            if(!(await fs.exists(path.home)))
            {
                console.log("%cHome directory needs to be created.", style.color2a)
                let home = await fs.createDirectory(path.home)
            }

            const dir = await fs.readDirectory(path.home)
            console.log("%cHome directory: " + JSON.stringify(dir, null, 2), style.color2c)

            //iterate home directory directories and files
            //for each dir/file put tile under stored coordinates
            const home = await fs.readDirectory("home")
            console.log(home.directories)
            home.directories.forEach((directory) =>
            {
                console.log(directory)

                let tile = document.createElement("div")
                tile.className = "tile color1"
                tile.setAttribute("onclick", "window.rpg.ui.click(event)")

                let bar = document.createElement("div")
                bar.className = "bar"
                bar.textContent = directory.name

                tile.appendChild(bar)
                get("#screen").appendChild(tile)
                //create directory tile
                //style tile based on something
            })
        }
    }

    /*
        doing it
    */
    this.init.begin()
}

window.rpg = new RPG()
