
// server.js - Servidor Express para obtener imágenes y precios de Amazon
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/scrape", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(data);

        // Extraer imagen del producto
        let imgUrl = $("img[src*='m.media-amazon']").attr("src") || "https://via.placeholder.com/150";

        // Extraer el precio del producto
        let price = $("#priceblock_ourprice, #priceblock_dealprice, .a-price-whole").first().text().trim() || "Price not available";

        res.json({ image: imgUrl, price });
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
