const express = require('express')

const port = 3000;
const ip = '127.0.0.1';
const app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.json());
app.use(express.static('public'));

const sendResponse = (filename , statuscode , res) => {
    fs.readFile(`${filename}` , (error , data) => {
        if(error){
            res.statuscode = 500;
            res.setHeader('Content-Type' , 'text/plain');
            res.send('Error');
        } else {
            res.statuscode = statuscode;
            res.setHeader('Content-Type' , 'text/html');
            res.end(data);
        }
    });
};

app.get('/' , (req , res) => {
    sendResponse(`HomePage.html` , 200 , res);
});

app.get('/Login.html' , (req , res) => {
    sendResponse(`Login.html` , 200 , res);
});

app.post('/Login.html' , urlencodedParser , (req , res) => {
    const {account : userID , password} = req.body;
    console.log(req.body , userID , password);
    db.query(`SELECT * FROM Users WHERE UserID='${userID}' AND Password='${password}';` , 
            (err , rows , fields) => {
                console.log(err)
                console.log(rows)
                console.log(fields);
                
                if(rows.length === 0){
                    return res.send({error : 'ACCOUNT_NOT_EXIST'});
                };
                console.log('success');
                return res.send({message:'LOGIN_SUCCESSFULLY'});
                
            });
});

app.listen(port , ip , () => {
    console.log(`Server is running http://${ip}:${port}/`)
});