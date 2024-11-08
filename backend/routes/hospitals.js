const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// GET /covid/hospitals/resources (fetch all hospitals)
router.get('/hospitals/resources', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/hospitals/resources/:region', async (req, res) => {
  const region = req.params.region.toLowerCase();  // Normalize to lowercase
  
  console.log(`Request received for region: ${region}`);  // Log the incoming region

  try {
    const hospitalResources = await Hospital.findOne({ region: region });

    if (!hospitalResources) {
      console.log(`Hospital resources for ${region} not found.`);
      return res.status(404).json({ message: `Hospital resources for ${region} not found.` });
    }

    res.json(hospitalResources);
  } catch (error) {
    console.error("Error fetching hospital resources:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT /covid/hospitals/resources/update/:region
router.put('/hospitals/resources/update/:region', async (req, res) => {
  const { beds_available, ventilators_available, icu_capacity } = req.body;
  const region = req.params.region.toLowerCase();  // Extract the region from the URL

  console.log('Incoming PUT Request:', req.body, 'for region:', region);  // Log incoming data

  try {
    // Case-insensitive region search (using region from the URL)
    const updatedHospital = await Hospital.findOneAndUpdate(
      { region: region },
      { beds_available, ventilators_available, icu_capacity },
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ message: `No hospital resources found for region: ${region}` });
    }
    console.log('Updated Hospital Data:', updatedHospital);  // Log updated data
    res.json(updatedHospital);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
});



module.exports = router;
