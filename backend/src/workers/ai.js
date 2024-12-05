const axios = require("axios");

/**
 * Generate text using an AI API
 * @param {String} prompt - The input prompt for the AI model
 * @param {Object} options - Additional options for text generation
 * @returns {String} - Generated text
 */
const generateText = async (prompt, options = {}) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003", // Use the appropriate model
                prompt,
                max_tokens: options.maxTokens || 100,
                temperature: options.temperature || 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("AI Worker Error:", error.response?.data || error.message);
        throw new Error("Failed to generate text");
    }
};

module.exports = { generateText };
