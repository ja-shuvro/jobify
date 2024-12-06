const generateDescription = require('../services/aiService');

const generateDescriptionAPI = async (req, res) => {
    const { entityDetails, entityType } = req.body;

    if (!entityDetails || !entityType) {
        return res.status(400).json({ message: 'Entity details and type are required.' });
    }

    try {
        // Call the generateDescription function
        const description = await generateDescription(entityDetails, entityType);

        return res.status(200).json({ description });
    } catch (error) {
        console.error('Error generating description:', error);
        return res.status(500).json({ message: 'Failed to generate description.' });
    }
};

module.exports = generateDescriptionAPI
