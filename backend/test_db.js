const mongoose = require('mongoose');
const uri = "mongodb+srv://zechsoftservicesandconsulting_db_user:dnx7IUxC0rvr1jIU@cluster0.2gxv8m6.mongodb.net/herb_immortal?appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Connection failed:", err);
        process.exit(1);
    });
