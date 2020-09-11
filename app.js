
//First thing, require the three modules that we installed with command "npm install express body-parser request" in the terminal
const express = require ("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express(); //new instance of express
app.use(bodyParser.urlencoded({extended: true}));

// Input the below because our styles.css file is local/static (otherwise css and images are not loaded)
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
   
});  
 //to create the post route and body-parser code:
 app.post("/", function(req, res) {

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

//The below from Mailchimp Audiences. "Members" is an array of individual objects.
// The object will then be turned to string with: JSON.stringify(data)
const data = {
  members: [
    {
      email_address: email, // var "email" defined above
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
    
};

const jsonData = JSON.stringify(data); //The object above will then be turned to string with: JSON.stringify(data)

const url = "https://us17.api.mailchimp.com/3.0/lists/ab680c9e10"; //Mailchimp url referrred to in the API documentation: "Code examples" section

const options = {
  method: "POST",
  auth: "georgi9:5c5268e4c6a045e599624197a1a62abe-us17" //any random string "georgi9" in this case, before the API key input.
}

const request = https.request(url, options, function(response) { //Https request
    
    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    };
    
    
    response.on("data", function (data){
        console.log(JSON.parse(data));
    });
    });
    
    request.write(jsonData); // request from the Mailchimp server
    request.end();
    
 });

//create route for the /filure page -- when subscriber clicks on the "Try Again" button on the /failure page.
app.post("/failure", function(req, res){
    res.redirect("/");
})

// The port 3000 will be replaced by "process.env.PORT" once we deploy using Heroku, to let heroku choose the port. 
// Or 3000 port option whne we run locally

app.listen(process.env.PORT || 3000, function() { 
    console.log("Server is running on port 3000");
});

// Mailchimp API Key: 5c5268e4c6a045e599624197a1a62abe-us17
 
// Mailchimp List ID: ab680c9e10