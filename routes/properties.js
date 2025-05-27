const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const redisClient = require('../config/redisconfig');


router.get('/' , (req ,res) => {
    res.send({
        "HELLO WORLD" : "PROPERTY ROUTE",
    })
})


// Middleware to check if the user is authenticated or not
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send({ msg: 'Not Authenticated' });
}



// Add a New Property
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const newProperty = new Property({
            ...req.body,
            createdBy: req.user.id
        });
        await newProperty.save();
        res.status(201).send({ 
            msg: 'Property Created', 
            data: newProperty 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Server Error' });
    }
});




// Get all the Properties of a Particular User
router.get('/get-user-properties', isAuthenticated , async (req ,res) => {
        try{
            const cached = await redisClient.get('user-properties_' + req.user.id);
            if (cached) {
                return res.json({ msg: 'From cache', data: JSON.parse(cached) });
            }


            const data = await Property.
                    find({createdBy: req.user.id}).
                    populate('createdBy').
                    exec();
            await redisClient.setEx('user-properties_' + req.user.id, 60, JSON.stringify(data));
            res.send({
                msg: 'User Properties Fetched',
                data: data
            });
        }
        catch(err){
            console.log(err);
            res.status(500).send({
                msg: 'Internal Server Error'
            });
        }
});


// Get all Properties
router.get('/get-all', isAuthenticated , async (req, res) => {
    try {
        const cached = await redisClient.get('all_properties');
        if (cached) {
            return res.json({ msg: 'From cache', data: JSON.parse(cached) });
        }

        
        const properties = await Property.find().populate('createdBy').exec();
        await redisClient.setEx('all_properties', 60, JSON.stringify(properties));
        
        res.send({
            msg: 'All Properties Fetched',
            data: properties
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Server Error' });
    }
});



// Update any particlar Property by ID
router.put('/update/:id', isAuthenticated, async (req, res) => {
    try {
        await redisClient.del('all_properties');
        await redisClient.del('user-properties_' + req.user.id);


        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ msg: 'Please provide at least one field to update' });
        }

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        if (!property.createdBy.equals(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to update this property' });
        }

        // For Amenties Updation Logic
        if (req.body.amenities && Array.isArray(req.body.amenities)) {
            const currentAmenities = new Set(property.amenities);
            req.body.amenities.forEach(item => currentAmenities.add(item));
            property.amenities = Array.from(currentAmenities);
            delete req.body.amenities; // remove from req.body to avoid overwriting
        }
        
        // For Tags Updation Logic
        if (req.body.tags && Array.isArray(req.body.tags)) {
            const currentTags = new Set(property.tags);
            req.body.tags.forEach(item => currentTags.add(item));
            property.tags = Array.from(currentTags);
            delete req.body.tags;
        }
        

        Object.assign(property, req.body);
        await property.save();
        res.send({ 
            msg: 'Property Updated', 
            data: property 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});







// Delete a Property by ID
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await redisClient.del('all_properties');
        await redisClient.del('user-properties_' + req.user.id);

        
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).send({ msg: 'Property not found' });
        }

        if (!property.createdBy.equals(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to delete this property' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.send({ 
            msg: 'Property Deleted' 
        });
    } 
    
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});



module.exports = router;