const express = require('express');
const app = express();


app.use(express.json());

//allowing access from origin null
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "null"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//setting up firebase firestore database
var admin = require('firebase-admin');
const databasePassword = require('./hackschoolfinalproject-firebase-adminsdk-y4a3e-4f4e6b203d.json');

// tell the library to connect to the database for us 
// using the given password.
admin.initializeApp({
    credential: admin.credential.cert(databasePassword)
});

const DB = admin.firestore();
const posts = DB.collection('posts');

// const db = [];

app.get("/", (req, res)=>{
    res.sendFile('/Users/saarthaksharma/Documents/Final-Hackschool-Project/frontend/index.html');
    
});

// app.get("/picture", (req, res)=>{
//     // let dbData = [];
//     for(var i = 0; i < db.length; i++){
//         // dbData.push({
//             'id': i,
//             // 'artist': db[i].artist,
//             // 'professor': db[i].professor
//         });
//     }
//     res.json(dbData);
// });

app.get("/picture/:id", async (req, res)=>{
    const id = req.params.id;
    res.setHeader('Content-Type', 'image/png');
    
    console.log("getting picture at id" + id);
    // console.log(db[id].artist)
    
    const postRef = await posts.doc(id).get();
    
    if (!postRef.exists) {
        res.status(404);
        res.json({ message: 'Task does not exists' });
        console.log("postred does not exist")
        return;
    }

    console.log("Post data does exist!!!");
    console.log("DATA:"+  postRef.data());

    console.log("Artist: "+  postRef.data().artist);
    console.log("Professor: " + postRef.data().professor);

    
    var picData = await postRef.data().rawPicture;

    res.send(picData);
    // res.write(db[id].rawPicture);
    

});

app.post('/picture',
    express.raw({ type: 'image/png' }),
    async (request, response) => {
        // Here, request.body is a Buffer object containing the PNG data.
        console.log("Content Type: " + request.get('Content-Type'));
        // console.log("Content Type: " + request.header('content-type'));

        console.log("Mode: " + request['mode']);

        task = {
            body: 'hi',
            sender: 'saarthak'
        }

        //determine which id to put the document at
        const extras = DB.collection('extras');
        var extraData = await extras.doc('data').get();
        console.log("Extra Data:");
        console.log(extraData);
        var count = extraData.data().count;
        console.log("Count 1: " + count);

        newPost = {
            artist: request.query.artist,
            professor: request.query.professor,
            rawPicture: request.body
        }

        await posts.doc(''+ count).set(newPost);
        console.log("Count: " + count);
        // db.push(newPost);

        //increment count
        extras.doc('data').set({'count': (count+1)});

        // console.log(db);

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

