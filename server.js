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
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);

        // Extraer imagen del producto (buscando la principal)
        let imgUrl = $("#landingImage").attr("src") || $("img[data-old-hires]").attr("data-old-hires") || $("img[src*='m.media-amazon']").attr("src") || "https://via.placeholder.com/150";

        // Extraer el precio del producto
        let price = $("#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen").first().text().trim();
        if (!price) {
            price = $("span.a-price .a-offscreen").first().text().trim();
        }
        if (!price) {
            price = "Price not available";
        }

        res.json({ image: imgUrl, price });
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape data", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// package.json - Configuración del proyecto
const packageJson = {
    "name": "amazon-scraper",
    "version": "1.0.0",
    "description": "API para obtener imágenes y precios de productos de Amazon",
    "main": "server.js",
    "scripts": {
        "start": "node server.js"
    },
    "dependencies": {
        "axios": "^1.3.0",
        "cheerio": "^1.0.0-rc.12",
        "cors": "^2.8.5",
        "express": "^4.18.2"
    }
};

// Procfile - Archivo para Railway
const procfile = "web: node server.js";

// .gitignore - Ignorar archivos innecesarios
the_gitignore = "node_modules\n.env\n";
