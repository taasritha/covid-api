const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// GET /covid/cases
router.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /covid/cases/:region
router.get('/cases/:region', async (req, res) => {
  try {
    const region = req.params.region;  // Get the region from the URL parameter
    const caseData = await Case.findOne({ region: { $regex: new RegExp('^' + region + '$', 'i') } });  // Case-insensitive search

    if (!caseData) {
      return res.status(404).json({ message: "Region not found" });  // Handle case where region doesn't exist
    }

    res.status(200).json(caseData);  // Return the found data for that region
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// POST /covid/cases/update
router.put('/cases/update/:region', async (req, res) => {
  const { active_cases, recoveries, deaths } = req.body;
  const region = req.params.region.toLowerCase();  // Get region from the URL

  console.log('Incoming PUT Request:', req.body, 'for region:', region);  // Log the incoming data

  try {
    // Case-insensitive region search (using region from the URL)
    const updatedCase = await Case.findOneAndUpdate(
      { region: region },
      { active_cases, recoveries, deaths },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: `No cases data found for region: ${region}` });
    }
    console.log('Updated Cases Data:', updatedCase);  // Log updated data
    res.json(updatedCase);  // Return updated data
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
});
module.exports = router;
