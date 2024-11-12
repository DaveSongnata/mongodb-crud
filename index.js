const express = require ("express");
const {MongoClient , ObjectId} =  require ('mongodb'); 

//Config Mongo
const url = "mongodb://localhost:27017"
const dbName = "backendx"
const client = new MongoClient(url)

//Config express
const app = express();
app.use (express.json());

//main

async function main(){
    // conexão bd

console.info("Conectando ao banco de dados...");
await client.connect(); //usa propriedade connect do Mnongo para tentar uma conexão com o banco! (e da await)
console.info("Banco de dados conectado!");
const db = client.db(dbName);// usa  a propriedade db do Mongo (e diz que é dbName)
const collection = db.collection ("herois");

//Rota inicial

app.get("/", function (req,res){
res.send("HELLO WORLD");
})

app.get("/herois", async function (req, res){
    const itens = await collection.find().toArray();
    res.send(itens);
    console.log ("Retornado todos os Itens");
});

app.get("/herois/:id", async function(req,res) {
    const id = req.params.id;
    const item = await collection.findOne({_id: new ObjectId(id)});
    res.send(item);
    console.log("Retornando com sucesso o id: ", id);

});

app.put ("/herois/:id", async function(req, res){
    const id = req.params.id;
    const item = req.body;
    await collection.updateOne({_id: new ObjectId(id)}, {$set: item});
    res.send(item);
    console.log("foi atualizado o item", id, " para ", item);
});

app.post ("/herois", async function(req, res){
    const item = req.body;
    await collection.insertOne(item);
    res.send(item);
})

app.delete("/herois/:id", async function(req, res){
    const id = req.params.id;
    await collection.deleteOne({_id: new ObjectId(id)});
    res.send("Item removido com sucesso"); 

})


console.log ("Servidor Ligado! (PORT:3000 LISTENING)")
app.listen (3000);
}

main();