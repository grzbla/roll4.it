// imports
import {uuid, systemPath, style} from "./modules/base.js"

// third party imports
import fs from "../lib/indexed.filesystem.js"
/*
    isFile,
    exists,
    copyFile,
    moveFile,
    readFile,
    writeFile,
    removeFile,
    renameFile,
    fileDetails,
    readDirectory,
    createDirectory,
    removeDirectory,
    rootDirectoryName
*/

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

            const right = (width - x) < (width * 0.5)
            const top = (height - y) > (height * 0.5)

            // cosnt r =

            //todo select closest side
            const result = this.ui.raycast({x: x, y: y}, [{x: width * 0.5, y: 0, side: "top"}, {x: width, y: height * 0.5, side: "right"},
                                           {x: width * 0.5, y: height, side: "bottom"}, {x: 0, y: height * 0.5, side: "left"}])
            result.sort((a, b) =>
            {
                const aAverage = (a.x + a.y) * 0.5
                const bAverage = (b.x + b.y) * 0.5
                if (aAverage < bAverage)
                    return -1
                else if (aAverage > bAverage)
                    return 1

                return 0
            })
            const direction = result[0]


            let effect = "click-effect-" + direction.side

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
            if(!(await fs.exists(systemPath.home)))
            {//indexeddb-fs is very whiny when it comes to not existing directories
            //need to preemptively create those
                console.log("%cHome directory needs to be created.", style.color2a)
                let home = await fs.createDirectory(systemPath.home)
            }

            const dir = await fs.readDirectory(systemPath.home)
            console.log("%cHome directory: " + JSON.stringify(dir, null, 2), style.color2c)

            //iterate home directory directories
            //for each dir/file put tile under stored coordinates
            const home = await fs.readDirectory("home")
            const homeElement = get("#home")
            home.directories.forEach((directory) =>
            {
                this.ui.createTile(directory, "/home", homeElement)
            })

            //iterate home directory files
            home.files.forEach((file) =>
            {
                this.ui.createTile(file, "/home", homeElement)
            })
        },
        createTile: async (item, path, parent) =>
        {
            const isFile = await fs.isFile(item.fullPath)
            if ( isFile && !(item.filesystem))
            { //read from fs if file doesn't look like drag n dropped
                item = await fs.readFile(item.fullPath)
            }

            let tile = document.createElement("div")
            tile.className = (item.tile && item.tile.size ? item.tile.size : "base") + "-tile"
            tile.style.setProperty("background-color", "var(--color-" + (Math.floor(Math.random() * 7) + 1)  + "c)")
            tile.setAttribute("onclick", "window.rpg.ui.click(event)")
            tile.setAttribute("onmousedown", "window.rpg.ui.dnd.mouseDown(event)")
            tile.setAttribute("ondragend", "window.rpg.ui.dnd.dragEnd(event)")
            tile.setAttribute("draggable", "true")
            tile.setAttribute("type", ((item.type == "directory") ? "directory" : item.type))

            let icon = document.createElement("span")
            if (isFile)
            {
                icon.className = "icon fa-duotone fa-file-lines"
                // icon.className = "icon fa-duotone fa-file-image"
                // <i class="fa-duotone fa-file-lines"></i>
            }
            else
            {
                // icon.className = "icon fa-duotone fa-file-lines"
                icon.className = "icon fa-duotone fa-grip-dots"
                // <i class="fa-duotone fa-grip-dots"></i>

            }
            tile.appendChild(icon)

            let bar = document.createElement("span")
            bar.className = "bar"
            bar.textContent = item.name.toLowerCase()

            tile.appendChild(bar)
            if (parent)
            {
                const tiles = [...parent.querySelectorAll("div[class*='tile']")]
                if (!tiles.find(element => element.querySelector(".bar").textContent == tile.textContent))
                    parent.appendChild(tile)
            }
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
        raycast: (point, targets) =>
        {
            let output = []
            for (let i = 0, l = targets.length; i < l; i++)
            {
                const target =  targets[i]

                const out = {...target, x: this.ui.subMinFromMax(point.x, target.x), y: this.ui.subMinFromMax(point.y, target.y)}
                output.push(out)
            }
            return output
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
                position = this.ui.snap(position, this.ui.tileSize[tileSizeName], {x: 50, y: 40})

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
            },
            readDroppedFiles: async (item, path, dropPath, event) => // reads files at current path recursively
            {
                path = path || "";

                // writes files to indexeddb
                // create a+nd traverse directory if directory
                if (item.isDirectory)
                {// indexeddb-fs is whiny when it comes to directories
                // which do not exist
                    const name = this.sanitize(item.name)
                    const p = dropPath + "/" + path + name

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
                }//save file if file
                else if (item.isFile)
                {
                    this.ui.dnd.saveFile(item, dropPath + "/" + path)
                }

                // and adds tiles to home folder
                const splat = path.split("/")
                if (splat.length == 1)
                { //qualify only top files/dirs for display in home directory
                    this.ui.createTile(item, "/home", get("#home"))
                }

                // and then adds tiles to whatever is currently displayed in viewer or whatever you call that shit now
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
            //TODO some color saving and shit = stuff
            document.body.style.setProperty("--background-color", "var(--color-" + (Math.floor(Math.random() * 7) + 1) + "e)");
            let root;
            try
            {
                root = await fs.exists("root")
            }
            catch (e) //indexedb can't connect because blocked cookies/local storage
            {
                //TODO display ui error and confirmation prompt
                console.error("Can't access local database. Enable cookies or some shit.\nTried reading root directory and it failed, disabled cookies/local storage is top reason.\nI'm not loading. Actual reason though:")
                console.error(e)
                return;
            }
            /* USER, CLIENT AND INSTANCE DATA */
            let user, client;
            if(!(await fs.exists(systemPath.user)))
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

                fs.writeFile(systemPath.user, user)
                fs.writeFile(systemPath.client, user)
            }

            console.log("%cInstance ID needs to be created.", style.color2a)
            this.instance =
            {
                id: uuid(3)
            }
            console.log("%cInstance ID: " + JSON.stringify(this.instance, null, 2), style.color2b)

            this.ui.loadHome()
        }
    }

    /*
        doing it
    */
    this.init.begin()
}

window.rpg = new RPG()
