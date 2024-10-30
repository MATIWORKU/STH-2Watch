import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_Key = "https://api.jikan.moe/v4/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try{
        const result = await axios.get(API_Key + "random/anime");
        const synopsis = result.data.data.synopsis ? result.data.data.synopsis.substring(0, 150) + "..." : "No description available";
        res.render("index.ejs", { content: { ...result.data.data, synopsis } });
    }catch (error){
        res.render("index.ejs");
        console.error(error.response);
    }
})

app.get("/recommend", async (req, res) => {
    try{
        const result = await axios.get(API_Key + "recommendations/anime"); 
        const data = result.data.data[Math.floor(Math.random() * result.data.data.length)];
        res.render("recommendation.ejs", { content: data});
    }catch (error){
        res.render("recommendation.ejs");
        console.error(error.message);
    }
})

app.get("/search", async (req, res) => {
    const params ={
        type: req.query.type,
        status: req.query.status,
        rating: req.query.rating,
        min_score: req.query.min_score,
        start_date: req.query.start_date,
        q: req.query.q,
        page:req.query.page || 1,
        limit:6
    }
    try{
        const result = await axios.get(API_Key + "anime", { params });
        res.render("search.ejs", { 
            contents: result.data.data,
            current_page: params.page,
            has_next_page: result.data.pagination.has_next_page,
            query: req.query
        });
    }catch (error){
        res.render("search.ejs");
        console.error(error.message);
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})