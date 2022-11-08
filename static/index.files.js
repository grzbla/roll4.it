const fs = require('fs').promises;
const {join} = require('path');

//globals
let files = { path: {}, type: {}, directory: {} };
let cache = [];
let cacheVersion = 1;
let cacheVersionFileName = "./cache.version.txt";
let startPath = "./nothing_here";
let staticIndexFileName = "./static.json";
let cacheManifest = "./manifest.appcache";
let cacheUseFileName = "./service.worker.use.js";
let nonoPaths = ["data", "assets"];

//iterate
const indexFiles = async (dirPath) => await Promise.all(
    (await fs.readdir(dirPath, {withFileTypes: true})).map(async (dirent) =>
    {
        //get path info
        let path = join(dirPath, dirent.name);
        let stat = await fs.stat(path);

        if (dirent.isDirectory()) //more recursion when folder
        {
            if (!nonoPaths.includes(dirent.name))
                await indexFiles(path);
        }
        else //get file info when file
        {

            //convert them slashes to web friendly
            path = path.replaceAll("\\", "/");

            //get file type
            let splat = path.split(".");
            const type = splat[splat.length - 1];

            //get file name
            splat = path.split("/");
            const name = splat.splice(-1, 1)[0];


            //update file with coverted path
            let file = {name: name, size: stat.size, mtime: stat.mtime, fullpath: path};

            //add file path to cache manifest
            cache.push(path);

            //add file to grouped by full path
            files.path[path] = file;

            //add file to grouped by file type
            if (!files.type[type])
                files.type[type] = {};
            files.type[type][path] = file;

            //add file to grouped by folder
            splat = splat.join("/");
            files.directory[splat] = file;
        }

    })
)

async function twerp()
{
    //index files
    await indexFiles(startPath);
    console.log(files);

    //write to file
    await fs.writeFile(staticIndexFileName, JSON.stringify(files));

    //increment cache version
    let exists = await fs.stat(cacheVersionFileName).catch( error => false);
    if (exists)
    {
        cacheVersion = parseInt(await fs.readFile(cacheVersionFileName));
        if (Number.isInteger(cacheVersion))
            cacheVersion++;
    }

    let cacheUseFile = "var CACHE_NAME = 'This shit is cached bro.';\nvar shitToCache = " + JSON.stringify(cache) + ";\n" + await fs.readFile("./service.worker.chunk");
    await fs.writeFile(cacheUseFileName, cacheUseFile);

    //write cache version file
    cache.unshift(...["CACHE MANIFEST", "# v" + cacheVersion + " " + new Date().toLocaleDateString('en-CA'), "", "CACHE:"]);
    await fs.writeFile(cacheVersionFileName, cacheVersion.toString());

    //write cache manifest
    await fs.writeFile(cacheManifest, cache.join("\n"));
}

twerp();
