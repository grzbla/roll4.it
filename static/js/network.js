function Peeri(peerid, callbacks)
{
    console.log(peerid, callbacks)
    this.peerid = peerid
    this.peer = new Peer(peerid)

    if (callbacks)
    {
        if (callbacks.open)
            this.peer.on("open", callbacks.open)
        if (callbacks.error)
            this.peer.on("error", callbacks.error)
        if (callbacks.connection)
            this.peer.on('connection', callbacks.connection);
    }

    return this;
}

//user, club, game
