function Peeri(preferredPeerID)
{
    this.init = async () =>
    {
        this.peer = new Peer(preferredPeerID)
        this.peerID = await this.open();
        console.log(preferredPeerID, this.peerID);
    }
    this.open = () =>
    {
        return new Promise(resolve =>
        {
            this.peer.on("open", (id) =>
            {
                resolve(id)
            })
        })
    }

    this.init();

}

//user, club, game
