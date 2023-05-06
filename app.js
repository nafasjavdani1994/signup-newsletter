const express = require("express");
const bodyParser = require("body-parser");
const superagent = require("superagent");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/bd7949e6ad";
  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP,
  };
  const request = https.request(url, options, (response) => {
    const statusCode = response.statusCode;
    if (statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port.");
});
