const {MongoClient} = require('mongodb');
const Express = require('express');
const app = Express();
const http = require('http').Server(app);
const Cors = require('cors');
const { response } = require('express');
const { emit } = require('process');

const io = require("socket.io")(port = 3002, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        }
    }
);

app.use(Cors());
uri = 'mongodb+srv://RRocha21:benfica10@g2.tehz06h.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/staticoverlays", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('staticoverlays').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/streamers", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('streamers').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/campaigns", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('campaigns').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/groups", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('groups').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/staticarts", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('staticarts').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/triggers", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('triggers').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

app.get("/sponsors", async (req, res) => {
    try {
        let result = await mongoClient.db("test").collection('sponsors').find({}).toArray();
        res.send(result);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('message', 'a user connected');
});



StaticOverlay = mongoClient.db("test").collection('staticoverlays');
changeOverlay = StaticOverlay.watch();
changeOverlay.on("change", async (change) => {
        let result = await mongoClient.db("test").collection('staticoverlays').find({}).toArray();
        let result2 = await mongoClient.db("test").collection('staticarts').find({}).toArray();
        console.log(result2)
        io.emit("Overlays_changeOverlay", {result, result2});
});

Streamer = mongoClient.db("test").collection('streamers');
changeStreamer = Streamer.watch();
changeStreamer.on("change", async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('streamers').find({}).toArray();
        let result2 = await mongoClient.db("test").collection('groups').find({}).toArray();
        let result3 = await mongoClient.db("test").collection('sponsors').find({}).toArray();
        io.emit("Overlays_changeStreamer", {result, result2, result3});
});

Sponsors = mongoClient.db("test").collection('sponsors');
changeSponsor = Sponsors.watch();
changeSponsor.on("change", async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('streamers').find({}).toArray();
        let result2 = await mongoClient.db("test").collection('groups').find({}).toArray();
        let result3 = await mongoClient.db("test").collection('sponsors').find({}).toArray();
        io.emit("Overlays_changeSponsor", {result, result2, result3});
});

Group = mongoClient.db("test").collection('groups');
changeGroup = Group.watch();
changeGroup.on("change", async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('streamers').find({}).toArray();
        let result2 = await mongoClient.db("test").collection('groups').find({}).toArray();
        let result3 = await mongoClient.db("test").collection('sponsors').find({}).toArray();
        io.emit("Overlays_changeGroup", {result, result2, result3});
});

StaticArt = mongoClient.db("test").collection('staticarts');
changeStaticArt = StaticArt.watch();
changeStaticArt.on("change", async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('staticoverlays').find({}).toArray();
        let result2 = await mongoClient.db("test").collection('staticarts').find({}).toArray();
        io.emit("Overlays_changeStaticArt", {result, result2});
});

Group = mongoClient.db("test").collection('groups');
changeGroup = Group.watch();
changeGroup.on("change", async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('groups').find({}).toArray();
        io.emit("Overlays_changeGroup", result);
});

Campaign = mongoClient.db("test").collection('campaigns');
changeCampaign = Campaign.watch();
changeCampaign.on("change",async (change) => {
        console.log("enviado");
        let result = await mongoClient.db("test").collection('campaigns').find({}).toArray();
        io.emit("Campaigns_changeCampaign", result);
})

Trigger = mongoClient.db("test").collection('triggers');
changeTrigger = Trigger.watch();
changeTrigger.on("change",async (change) => {
        console.log("enviado");
        let n = 0;
        let result = await mongoClient.db("test").collection('triggers').find({}).toArray();
        let flag = false;
        for (let i = 0; i < result.length; i++) {
            if (result[i].triggerStatus) {
                flag = true;
                n = i;
                break;
            }
        }
        if (flag) {
            io.emit("Triggers_changeTrigger", result[n]);
        }
})

app.listen(3001, async () => {
    try {
        await mongoClient.connect();

        console.log('listening on *:3001');
    } catch (error) {
        console.log(error);
    }
});

