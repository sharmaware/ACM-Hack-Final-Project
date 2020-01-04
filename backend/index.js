const express = require('express');
const app = express();


app.use(express.json());


const db = [];

app.get("/", (req, res)=>{
    res.sendFile('../frontend/index.html');
    
});

app.get("/picture", (req, res)=>{
    let dbData = [];
    for(var i = 0; i < db.length; i++){
        dbData.push({
            'id': i,
            'artist': db[i].artist,
            'professor': db[i].professor
        });
    }
    res.json(dbData);
});

app.get("/picture/:id", (req, res)=>{
    const id = req.params.id;
    res.setHeader('Content-Type', 'image/png');
    
    console.log("getting picture at id" + id);
    console.log(db[id].artist)
    
    res.write(db[id].rawPicture);
    

});

app.post('/picture',
    express.raw({ type: 'image/png' }),
    (request, response) => {
        // Here, request.body is a Buffer object containing the PNG data.
        console.log("Content Type: " + request.get('Content-Type'));
        // console.log("Content Type: " + request.header('content-type'));
        
        console.log("Mode: " + request['mode']);
        
        db.push({
            artist: request.query.artist,
            professor: request.query.professor,
            rawPicture: request.get('body')
        });

        console.log(db);
    
        console.log("Buffer size:" + Buffer.byteLength(request.body)); //using bytelength function to see if request.body is a buffer object
    });

// app.post("/picture", express.raw({type: 'image/png'}), (req, res)=>{
//     db.push({
//         artist: req.query.artist,
//         professor: req.query.professor,
//         rawPicture: req.body

//     });
    
//     res.json({message: "picture stored"})
//     console.log("picture stored");
//     console.log(db);
//     console.log("Buffer size:" + Buffer.byteLength(req.body));
// });

// console.log("Request.body " + request.body);
        
// console.log("picture stored");
// console.log(db);


app.listen(3000);
console.log("server started on port 3000");

