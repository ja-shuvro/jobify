const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateDescription = async (entityDetails, entityType) => {
    try {
        const prompt = `Generate a detailed description for the following ${entityType}:
    ${JSON.stringify(entityDetails)}`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI that generates descriptions for ${entityType}s. 
                    You should provide a clear, concise, and informative description.`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        // Handle rate limit exceeded error
        if (error.code === 'insufficient_quota' || error.status === 429) {
            console.error("Rate limit exceeded. Please check your API usage and billing.");
            throw new Error("Rate limit exceeded. Please check your API usage and billing.");
        }

        console.error("Error generating description:", error);
        throw new Error("Failed to generate description");
    }
};

module.exports = generateDescription;
