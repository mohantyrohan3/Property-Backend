const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send({ msg: 'Not Authenticated' });
}



router.get('/', isAuthenticated ,  async (req, res) => {
    try {
        const {
            type,
            priceMin,
            priceMax,
            state,
            city,
            areaMin,
            areaMax,
            bedrooms,
            bathrooms,
            amenities,
            furnished,
            availableFrom,
            listedBy,
            tags,
            isVerified,
            listingType
        } = req.query;

        let query = {};

    
        if (type) query.type = type;
        if (state) query.state = state;
        if (city) query.city = city;
        if (furnished) query.furnished = furnished;
        if (listedBy) query.listedBy = listedBy;
        if (isVerified) query.isVerified = isVerified === 'true';
        if (listingType) query.listingType = listingType;

        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }

        if (areaMin || areaMax) {
            query.areaSqFt = {};
            if (areaMin) query.areaSqFt.$gte = Number(areaMin);
            if (areaMax) query.areaSqFt.$lte = Number(areaMax);
        }

        if (bedrooms) query.bedrooms = Number(bedrooms);
        if (bathrooms) query.bathrooms = Number(bathrooms);

        if (availableFrom) {
            query.availableFrom = { $gte: new Date(availableFrom) };
        }

        if (amenities) {
            const amenityArray = amenities.split(',');
            query.amenities = { $all: amenityArray };
        }

        if (tags) {
            const tagArray = tags.split(',');
            query.tags = { $all: tagArray };
        }

        const results = await Property.find(query).populate('createdBy');
        res.json({
            msg: 'Properties fetched with applied filters',
            count: results.length,
            data: results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});


module.exports = router;