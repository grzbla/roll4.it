/*
    SHIT HERE IS SUPPOSED TO BE INITIALIZED FIRST
*/

const style =
{
    log: "white-space: break-spaces; color: #ffffff9f",
    warn: "white-space: break-spaces; color: #ffffff9f; text-shadow: yellow 2px 0 10px",
    error: "white-space: break-spaces; color: #ffffff9f; text-shadow: red 2px 0 10px",
    pop: "white-space: break-spaces; color: lightgreen; text-shadow: #aaa 2px 0 10px",
    stack: "white-space: break-spaces; color: #ffffff7f; text-shadow: #aaa 1px 0 12px",
    red: "white-space: break-spaces; color: red; text-shadow: red 1px 0 12px",
    yellow: "white-space: break-spaces; color: yellow; text-shadow: yellow 1px 0 12px",
    pink: "white-space: break-spaces; color: pink; text-shadow: pink 1px 0 12px",
    blue: "white-space: break-spaces; color: #8383d2; text-shadow: #8383d2 1px 0 12px"
}


/*
    STRING HASH HELPER OBJECT
*/
function Hash(str)
{
    /*
        constructor for an object containing both hash and string
        gets passed by reference so its likely faster than string
        same speed as passing hash alone, but at the cost of couple bytes
    */
    s = str
    h = new MurmurHash3(s).result()

    this.set = (str) =>
    {
        s = str
        h = new MurmurHash3(s).result()
    }
    this.hash = () => { return h }
    this.string = () => { return s }

    return this
}


/*
    HASHMAP USES STRING, OBJ OR KEY TO IDENTIFY VALUES
*/
function HashMap()
{
    /*
        it's a hash map. thats it
        it works. i think
    */

    /*
        token maps in addition to base values map for ease of access
        in rare situations
    */
    this.strings = new Map() //strings mapped by hash, hash-string pair
    this.keys = new Map() //hashes mapped by string, string-hash pair
    this.values = new Map() // values mapped by hash, hash-value pair

    this.get = (token) =>
    {
        /*
            switch which variable is used as key
            sacrificed minimal performance for convenience of use
            three getters depending on key type seemed like
            solution for edge cases
        */
        const type = typeof(token)
        try // successful try often faster than multiple ifs
        {
            switch(type)
            {
                case "number": { return this.values.get(token) } //hash number directly
                case "object": { console.log(`%c${token}`, style.log); return this.values.get(token.hash()) } //hash
                case "string":
                {
                    if (this.keys.has(token))
                        return this.values.get(this.keys.get(token))
                    else
                        return this.values.get(new Hash(token))

                } //unhashed string
            }
        }
        catch(e)
        {
            console.warn(e)
        }
    }
    this.getByString = (string) => { return this.values.get(this.keys.get(string)) }
    this.getByHash = (key) => { return this.values.get(key) }
    this.getHash = (token) =>
    {
        /*
            gets hash value for provided string token
        */
        return this.keys.get(token)
    }
    this.getString = (token) =>
    {
        /*
            gets string for provided hash token
        */
        const type = typeof(token)
        if (type != "object") //number is more likely
            return this.strings.get(token)
        else
            return this.strings.get(token.hash())
    }
    this.set = (key, value) =>
    {
        /*
            generates hash, writes keys to maps for ease of access
            and in case only one type of token exists
        */
        const keyType = typeof(key)
        switch(keyType)
        {
            case "number": // key is int
            {
                if (this.values.has(key)) //if already presumably in the map
                    return false;

                //assigning only values because
                //there's no way to calculate string from hash number
                this.values.set(key, value)
                return key
                break
            }
            case "object": //key is hash
            {
                console.log(`%c${key}`, style.log)
                if (this.values.has(key.hash()))
                    return false

                this.strings.set(key.hash(), key.string())
                this.keys.set(key.string(), key.hash())
                this.values.set(key.hash(), value)
                return key.hash()
                break
            }
            case "string":
            {
                if (this.strings.has(key))
                    return false;

                const hash = new Hash(key)
                this.strings.set(hash.hash(), hash.string())
                this.keys.set(hash.string(), hash.hash())
                this.values.set(hash.hash(), value)

                return hash.hash()
            }
        }
    }
    this.del = (token) =>
    {
        /*
            entrius deletus
        */
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { key = token, string = this.strings.get(token); break; }
            case "object": { key = token.hash(), string = token.string(); break; }
            case "string": { key = this.keys.get(token), string = token; break; }
        }

        console.log(`%c${key}: ${string}`, style.log)

        if (string && this.keys.has(string))
            this.keys.delete(string)
        if (key && this.strings.has(key))
            this.strings.delete(key)
        if (key && this.values.has(key))
            this.values.delete(key)
    }
    this.has = (token) =>
    {
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { return this.keys.has(token); break; }
            case "object": { return this.keys.has(token.get()); break; }
            case "string": { return this.strings.has(token); break; }
        }
    }


}

/*
    LOGGING HELPER
*/
function De()
{
    /*
        it's short for the
        short console log. use if line number in console is not needed
        it messes with your line number in console. what, surprised?
    */
    this.bug = (...args) =>
    {
        const stackSplat = (new Error).stack.split("\n")
        const stack = stackSplat.slice(-2).join("\n")
        const dateTimeSplat = new Date().toJSON().split("T")
        const datetimeString = dateTimeSplat[1] + " " + dateTimeSplat[0];

        //TODO group collapsed
        setTimeout(console.log.bind(console, ...args))
        setTimeout(console.log.bind(console, "\t%c%s,%s\n", style.stack, datetimeString, stack))
    }

    return this
}

/*
    PROGRESS HELPER OBJECT
*/
function Progress(loaded, total)
{
    /*
        progress object to count percentages and fractions for progress bars
    */
    this.loaded = loaded
    this.total = total

    this.getFraction = () =>
    {
        //fraction is rounded to 4 decimal places
        return +((this.loaded/this.total).toFixed(4))
    }

    this.getPercentage = () =>
    {
        //percentage is rounded to 2 decimal places
		return +( ( this.getFraction() * 100 ).toFixed(2) )
    }

    return this
}

/*
    CONNECTION HELPER OBJECT
    FELT CUTE, MIGHT DELETE LATER
*/
function Transaction(c)
{
    this.c = c

    this.send = (data) =>
    {
        this.c.send(data)
    }
    this.close = () =>
    {
        this.c.close()
    }
}

/*

*/
