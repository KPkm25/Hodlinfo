const axios = require("axios");
const CryptoSchema = require('../models/cryptoModel');
const moment = require('moment');
require('moment-timezone');

const fetchDataAndRender = async (req, res) => {
    try {
        const apiResponse = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const apiData = await apiResponse.data;

        const topTenRecords = Object.values(apiData).slice(0, 10); // First 10 data

        const dataToInsert = topTenRecords.map((record) => new CryptoSchema(record));

        await CryptoSchema.insertMany(dataToInsert); // Database insertion

        const storedRecords = await CryptoSchema.find().sort({_id: -1}).limit(10); // Sort the data
        storedRecords.reverse(); // Reverse so that the highest is first

        const processedData = [];

        storedRecords.forEach((record) => {
            const { base_unit, name, buy, sell, volume, open, low, high, last } = record;

            const timestamp = moment.utc(record.at * 1000); // aaltu faltu time to a readable date
            const tradeTime = timestamp.tz('Asia/Kolkata').format('DD/MM/YYYY [at] h:mm A');

            const processedRecord = {
                baseUnit: base_unit.toUpperCase(),
                name,
                buy,
                sell,
                volume,
                open,
                low,
                high,
                last,
                tradeTime,
            };

            processedData.push(processedRecord);
        });

        await CryptoSchema.deleteMany({}); // Used to update the data by deleting the old one

        // Send the first data
        res.render('index', { data: processedData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal error fetching and storing data');
    }
};

module.exports = { fetchDataAndRender };
