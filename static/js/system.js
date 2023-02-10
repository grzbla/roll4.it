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

function PotatoRPG()
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
        string = this.replacer(string, this.handlers.dnd.disallowedChars.remove, "")
        string = this.replacer(string, this.handlers.dnd.disallowedChars.underscore, "_")
        return string
    }

    //this is obsolete i think
    this.createDirectory = (p) =>
    {
        fs.createDirectory(p).then((result) =>
        {
            console.log(p)
            const info =
            {
                name: p.split("/").pop(),
                stamp: Date.now()
            }

            console.log(info)
            fs.writeFile(p + "/info.json", info).then((nfo) =>
            {
                console.log(nfo)
            })
        }).catch((exception) =>
        {
            const error = new Error();
            console.log("%c" + exception.message, style.color1b)
            console.log("%c" + error.stack, style.color1b)

            // capture directory assertion error
            const match = (/\"(.*?)\" directory does not exist/g).exec(exception.message)
            if (match && match[1])
            {
                console.log("%c" + match[1], style.color1a)
                setTimeout((path) =>
                {
                    if (path.slice(-1) == "/")
                        path.pop()

                    this.createDirectory(path).then(() =>
                    {
                        fs.exists(path).then((result) =>
                        {
                            result ? console.log("%c" + path) : this.createDirectory(p)
                        })
                    })
                }, this.fileDelay, match[1])
            }
            //TODO finish when it occurs again
        })
    }

    /*
        handler functions
    */
    this.handlers =
    {
        // drag and drop
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
                event.preventDefault();
            },
            drop: (event) => //get files on drop
            {
                event.preventDefault();
                this.handlers.dnd.getFiles(event)
            },
            saveFile: (item, path) => //saves item as blob to path
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
                        this.handlers.dnd.writeFile(f, path)
                    });
                });
            },
            writeFile: async (f, path) => // writes f to path
            {
                const pathSanitized = this.sanitize(path)
                path = pathSanitized.slice(0, -1)

                setTimeout((path, file) =>
                {
                    fs.writeFile(path, file).then((result) =>
                    {
                        console.log("%c" + path, style.color3a)
                        //if path is currently displayed or home
                        //add icons to current view
                        this.fileDelayTick++
                    })
                }, this.fileDelay * this.fileDelayTick , pathSanitized + f.name, f)

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

                    if (!(await fs.exists(p)))
                        await fs.createDirectory(p)

                    var dirReader = item.createReader();
                    dirReader.readEntries((entries) =>
                    {
                        for (var i = 0; i < entries.length; i++)
                        {
                            this.handlers.dnd.readDroppedFiles(entries[i], path + name + "/", dropPath)
                        }
                    })
                }
                else if (item.isFile)//save file if file
                {
                    this.handlers.dnd.saveFile(item, dropPath + "/" + path)
                }
            },
            getFiles: (event) => // gets files from data transfer
            {
                const dropPath = event.target.getAttribute("data-fs-path")

                const items = event.dataTransfer.items;
                for (var i = 0; i < items.length; i++)
                {
                    var item = items[i].webkitGetAsEntry();
                    if (item)
                    {
                        this.handlers.dnd.readDroppedFiles(item, null, dropPath)
                    }
                }
            }

        },
    }
    this.user =
    {

    }

    this.network =
    {

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
            console.log(await fs.readDirectory("root"))
            console.log(await fs.readDirectory("home"))
        }
    }

    /*
        doing it
    */
    this.init.begin()
}

window.rpg = new PotatoRPG()
