
function De()
{
    this.bug = function()
    {
        console.log(...arguments);
    }
    return this;
}

var de = new De();
