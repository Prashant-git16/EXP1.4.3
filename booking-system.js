require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { client, connectRedis } = require("./redisClient");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const TOTAL_SEATS = 100;

async function startServer() {

    await connectRedis();

    await client.set("available_seats", TOTAL_SEATS);

    app.post("/api/book", async (req, res) => {

        const seats = await client.get("available_seats");

        if (seats <= 0) {
            return res.status(400).json({ success: false, message: "Sold Out" });
        }

        await client.decr("available_seats");

        const bookingId = Date.now();

        const remaining = await client.get("available_seats");

        res.json({
            success: true,
            bookingId,
            remaining
        });

    });

    app.listen(PORT, () => {
        console.log(`Booking system running on port ${PORT}`);
    });
}

startServer();