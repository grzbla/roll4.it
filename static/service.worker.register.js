if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service.worker.use.js',
    {
        scope: '/'
    }).then(function()
    {
        console.info('Service worker registered.');
    }).catch(function(e)
    {
        console.error(e, 'service worker registration failed');
    });
}
