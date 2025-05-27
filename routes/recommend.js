const express = require('express');
const router = express.Router();
const Recommend = require('../models/Recommend');
const User = require('../models/User');
const Property = require('../models/Property');


router.get('/' , (req , res) => {
    res.send("HELLO WORLD FROM RECOMMENDATION BACKEND");
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send({ msg: 'Not Authenticated' });
}

// Recommend to a User
router.post('/recommend-property' , isAuthenticated, async (req , res) => {
    const {email , propertyId} = req.body;
    if (!email || !propertyId) {
        return res.status(400).send({ msg: 'Email and Property ID are required' });
    }

    try{
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        if (!property.createdBy.equals(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized to update this property' });
        }



        const recommendation = new Recommend({
            from_user: req.user.id,
            property: propertyId ,
            to_user: user._id
        });
        
        await recommendation.save();

        res.send({
            msg: 'Recommendation sent successfully',
            recommendation: recommendation
        });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Internal Server Error' , error: error});
    }
});



// Get Recommendations for current User
router.get('/get-all', isAuthenticated, async (req, res) => {
    try {
        const recommendations = await Recommend.find({ to_user: req.user.id })
            .populate('from_user', 'name email')
            .populate('property');

        res.send({
            msg: 'Recommendations fetched successfully',
            recommendations: recommendations
        });
    } catch (error) {
        return res.status(500).send({ msg: 'Internal Server Error', error: error });
    }
});





module.exports = router;