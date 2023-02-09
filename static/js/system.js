import fs from '../lib/indexed.filesystem.js'
import {uuid, path, style} from './modules/base.js'

{
    const b = browserDetect()
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
    this.handlers =
    {
        dnd:
        {
            drag: (event) =>
            {
                event.preventDefault();
            },
            drop: (event) =>
            {
                this.handlers.dnd.getFiles(event)
                event.preventDefault();
            },
            saveFile: (item, path) =>
            {
                // Get file
                item.file((file) =>
                {
                    // const file = item.getAsFile();
                    file.arrayBuffer().then((arrayBuffer) =>
                    {
                        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
                        const f = {path: path, name: file.name, extension: file.name.split('.').pop(), data: blob, type: file.type, size: file.size}
                        //TODO save file to pouchdb path
                        console.log("TODO: save file to pouch db filesystem path")
                        console.log(f)
                        console.log(f.path.slice(0, -1))
                    });
                });
            },
            readFiles: (item, path, dropPath) =>
            {
                path = path || "";
                // iterate directory if directory
                if (item.isDirectory)
                {
                    var dirReader = item.createReader();
                    dirReader.readEntries(async (entries) =>
                    {
                        for (var i = 0; i < entries.length; i++)
                        {
                            this.handlers.dnd.readFiles(entries[i], path + item.name + "/", dropPath)
                        }
                    })
                }
                else if (item.isFile)//save file if file
                {
                    this.handlers.dnd.saveFile(item, dropPath + "/" + path)
                }
            },
            getFiles: async (event) =>
            {
                const dropPath = event.target.getAttribute("data-fs-path")
                console.log(dropPath)
                const items = event.dataTransfer.items;
                for (var i = 0; i < items.length; i++)
                {
                    var item = items[i].webkitGetAsEntry();
                    if (item)
                    {
                        this.handlers.dnd.readFiles(item, null, dropPath)
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


            /* HOME SCREEN INITIALIZATION */
            if(!(await fs.exists(path.home)))
            {
                console.log("%cHome directory needs to be created.", style.color2a)
                let home = await fs.createDirectory(path.home)
                console.log(home)
            }

            const dir = await fs.readDirectory(path.home)
            console.log("%cHome directory: " + JSON.stringify(dir, null, 2), style.color2c)

            //iterate home directory directories and files
            //for each dir/file put tile under stored coordinates
            console.log(await fs.readFile(path.user))

        }
    }

    /*
        doing it
    */
    this.init.begin()
}

window.rpg = new PotatoRPG()
