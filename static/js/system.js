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
        gridWidth: 20,
        gridHeight: 12,
        tileSize:
        {
            mini: {x: 80, y: 80},
            base: {x: 160, y: 160},
            wide: {x: 320, y: 160},
            tall: {x: 160, y: 320},
            large: {x: 320, y: 320},
            wider: {x: 640, y: 320},
            taller: {x: 320, y: 640},
            larger: {x: 640, y: 640}
        },
        getCursorPosition: (event) =>
        {
            const element = event.target
            console.log(element)
            var rect = element.getBoundingClientRect()
            var x = event.clientX - rect.left
            var y = event.clientY - rect.top
            this.ui.cursor = [x, y]
        },
        click: (event) =>
        {
            const rect = event.target.getBoundingClientRect()
            const x = event.clientX - rect.left, y = event.clientY - rect.top
            const height = event.target.offsetHeight, width = event.target.offsetWidth

            console.log(x, width, y, height)
            console.log(width - x, width * 0.5)
            const right = (width - x) < (width * 0.5)
            const top = (height - y) > (height * 0.5)

            // cosnt r =

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
        loadHome: async () =>
        {
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
                this.ui.createTile(directory)
            })
        },
        createTile: (item, event) =>
        {
            if (event)
                console.log(event)

            let tile = document.createElement("div")
            tile.className = (item.tile && item.tile.size ? item.tile.size : "base") + "-tile color1"
            tile.setAttribute("onclick", "window.rpg.ui.click(event)")
            tile.setAttribute("onmousedown", "window.rpg.ui.dnd.mouseDown(event)")
            tile.setAttribute("ondragend", "window.rpg.ui.dnd.dragEnd(event)")
            tile.setAttribute("draggable", "true")

            let bar = document.createElement("div")
            bar.className = "bar"
            bar.textContent = item.name

            tile.appendChild(bar)
            get("#home").appendChild(tile)
            //create directory tile
            //style tile based on something
        },
        subMinFromMax: (a, b) =>
        {
            return b > a ? b - a : a - b
        },
        snap: (position, size, offset) =>
        {
            //snap to grid
            position.x = (Math.floor(position.x / size.x) * (size.x + 26))
            position.y = (Math.floor(position.y / size.y) * (size.y + 26))
             //adjust for padding
            position.x += offset.x
            position.y += offset.y

            return position
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
            dragEnd: (event) =>
            {
                //assign position to dragged element
                var element = event.srcElement
                var rect = element.getBoundingClientRect()
                var x = event.clientX
                var y = event.clientY

                if (!this.ui.cursor)
                    this.ui.getCursorPosition(event)

                element.classList.add("placed")
            	let position = {x: x - this.ui.cursor[0], y: y - this.ui.cursor[1]}


                const tileSizeName = element.getAttribute("class").match(/(.*?)-tile/)[1]
                position = this.ui.snap(position, this.ui.tileSize[tileSizeName], {x: 50, y: 50})

                element.style.setProperty("left", position.x + "px")
                element.style.setProperty("top", position.y + "px")
            },
            drop: (event) => //get files on drop
            {
                event.preventDefault()
                if (event.dataTransfer.items.length > 0)
                    this.ui.dnd.getFiles(event)
                else
                    console.log(event)
            },

            //mouse is clicked
            mouseDown: (event) =>
            {
                this.ui.getCursorPosition(event)
            },
            raycast: (point, targets) =>
            {
                let output = []
                for (let i = 0, l = targets.length; i < l; i++)
                {
                    const target =  array[i]
                    let distance = {};

                    output.push({x: this.ui.subMinFromMax(point.x, target.x), y: this.ui.subMinFromMax(point.y, target.y)})
                }
                return output;
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
                        const f = { name: this.sanitize(file.name), extension: ((splat.length > 1) ? splat.pop() : null), blob: blob, type: file.type != "" ? file.type : null, size: file.size }
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
                // 0.0009765625 is 1/1024th
                file.size = (file.size * 0.0009765625 * 0.0009765625).toFixed(3)
                stats[file.name].size = file.size
                await fs.writeFile(statsPath, stats)

                console.log("%c" + path + ", " + (file.size) + "MiB", style.color3a)


            },
            readDroppedFiles: async (item, path, dropPath, event) => // reads files at current path recursively
            {
                this.fileDelayTick = 1
                path = path || "";

                // iterate directory if directory
                if (item.isDirectory)
                {
                    const name = this.sanitize(item.name)
                    const p = dropPath + "/" + path + name

                    if (path.split("/").length == 1) //if path one segment long
                    {
                        //reload #home
                        const home = get("#home")
                        const string = home.innerHTML

                        this.ui.createTile(item, event)
                    }

                    if (!(await fs.exists(p)))
                        await fs.createDirectory(p)

                    var dirReader = item.createReader();
                    dirReader.readEntries((entries) =>
                    {
                        for (var i = 0; i < entries.length; i++)
                        {
                            this.ui.dnd.readDroppedFiles(entries[i], path + name + "/", dropPath, event)
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

            this.ui.loadHome(path)
        }
    }

    /*
        doing it
    */
    this.init.begin()
}

window.rpg = new RPG()
