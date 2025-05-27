const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const Property = require('./models/Property');
const config = require("./config/mongoose");

const results = [];

const userIds = [
  "6835cfbd62877d62d85f2e29",
  "6835cfc562877d62d85f2e2b",
  "6835cfcb62877d62d85f2e2d",
  "6835cfd262877d62d85f2e2f",
  "6835cfdb62877d62d85f2e31",
];

function getRandomUserId() {
  const index = Math.floor(Math.random() * userIds.length);
  return userIds[index];
}

fs.createReadStream('properties.csv') // Make sure this is your filename
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      propertyId: data.id,
      title: data.title,
      type: data.type,
      price: Number(data.price),
      state: data.state,
      city: data.city,
      areaSqFt: Number(data.areaSqFt),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      amenities: data.amenities.split('|'),
      furnished: data.furnished,
      availableFrom: new Date(data.availableFrom),
      listedBy: data.listedBy,
      tags: data.tags.split('|'),
      colorTheme: data.colorTheme,
      rating: parseFloat(data.rating),
      isVerified: data.isVerified.toLowerCase() === 'true',
      listingType: data.listingType,
      createdBy: getRandomUserId(),
    });
  })
  .on('end', async () => {
    try {
      await Property.insertMany(results);
      console.log('CSV data successfully imported!');
      process.exit();
    } catch (err) {
      console.error('Error inserting data:', err);
      process.exit(1);
    }
  });