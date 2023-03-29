var game = new Phaser.Game(800, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create});
var myText = null;
var sprite = null;
var wshost = document.getElementById('websocket').getAttribute('data-wshost');
var wsport = document.getElementById('websocket').getAttribute('data-wsport');
console.count(wshost+":"+wsport)

function preload() {
    game.load.image("azLogo", "azure.logo.png");
}

function create() {
    this.client = new Client();
    this.client.openConnection();
    myText = game.add.text(0, 0, "started (not yet connected)", { font: "24px Arial", fill: "#ffffff"});
    sprite = game.add.sprite(0, 150, "azLogo");
    sprite.inputEnabled = true;
    sprite.input.enableDrag(false, true);
    sprite.events.onDragStop.add(azLogoDragged, this);
    game.stage.disableVisibilityChange = true;
    game.stage.backgroundColor = '#3399ff'
}

function azLogoDragged() {
    if (this.client.connected) {
        console.log(JSON.stringify({x: sprite.x, y: sprite.y}))
        this.client.ws.send(JSON.stringify({x: sprite.x, y: sprite.y}));
    }
}

function Client() {

}

Client.prototype.openConnection = function() {
    console.count("try connect: ws://"+wshost+":"+wsport)
    this.ws = new WebSocket("ws://"+wshost+":"+wsport);
    this.connected = false;
    // this.ws.on('close', this.connectionClose.bind(this));
    // this.ws.on('open', function open() {
    //     console.log('connected');
    //     this.ws.send(Date.now());
    //   });
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.displayError.bind(this);
    this.ws.onopen = this.connectionOpen.bind(this);
    this.ws.onclose = this.connectionClose.bind(this);
};

Client.prototype.connectionClose = function() {
    this.connected = false;
    console.log('Websocket: disconnected');
    myText.text = 'disconnected\n';
};

Client.prototype.connectionOpen = function() {
    this.connected = true;
    console.log('Websocket: connected:'+ Date.now());
    myText.text = 'connected\n';
};

Client.prototype.onMessage = function(message) {
    myText.text = myText.text + "\n" + message.data;
    var msg = JSON.parse(message.data);
    sprite.x = msg.x;
    sprite.y = msg.y;
};

Client.prototype.displayError = function(err) {
    console.log('Websocketerror: ' + err);
};
