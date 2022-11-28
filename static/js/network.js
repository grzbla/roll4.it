function Peeri(peerid, callbacks)
{
    this.peerid = peerid
    this.peer = new Peer(peerid)

    if (callbacks)
    {
        if (callbacks.open)
            this.peer.on("open", callbacks.open(id, maybeSomethingElse))
        if (callbacks.error)
            this.peer.on("error", callbacks.error(error, maybeSomethingElse))
    }

    return this;
}

//user, club, game
