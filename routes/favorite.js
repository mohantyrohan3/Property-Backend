const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');



router.get('/' , (req ,res) => {
    res.send({
        "HELLO WORLD" : "FAVORITE ROUTE",
    })
})


// Middleware to check if the user is authenticated or not
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send({ msg: 'Not Authenticated' });
}



// Add a property to favorites
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ msg: 'Please provide PropertyID to update' });
        }
        

        // Validate the User
        const { propertyId } = req.body;
        if (!propertyId) return res.status(400).json({ msg: 'propertyId is required' });

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        if (!property.createdBy.equals(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to update this property' });
        }


        const exists = await Favorite.findOne({ user: req.user.id, property: propertyId });       
        if (exists) return res.status(409).send({ msg: 'Already favorited' });

        const favorite = new Favorite({ user: req.user.id, property: propertyId });
        await favorite.save();


        res.send({ 
            msg: 'Property added to favorites', 
            data: favorite 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' , error: err.message });
    }
});


// Find all favorites of the current logged in user
router.get('/get-all', isAuthenticated, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id }).populate('property');
        res.send({ msg: 'Favorites fetched', data: favorites });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' , error: err.message });
    }
});


// Delete from the Favorites
router.delete('/delete/:propertyId', isAuthenticated, async (req, res) => {
    try {
        if(!req.params.propertyId) {
            return res.status(400).send({ msg: 'Please provide PropertyID to remove' });
        }

        const result = await Favorite.findOneAndDelete(req.params.propertyId);

        if (!result) return res.status(404).send({ msg: 'Favorite not found' });

        res.json({ msg: 'Property removed from favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Server Error'  , error: err.message });
    }
});







module.exports = router;