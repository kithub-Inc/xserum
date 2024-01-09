export default {
    "devServer": {
        "port": 3000,
        "liveReload": true,
        "host": "0.0.0.0",
        "allowedHosts": "all",
        "open": true,
        "client": {
            overlay: true,
            "webSocketURL": "ws://0.0.0.0:80/ws",
        },
        "compress": true,
    }
}