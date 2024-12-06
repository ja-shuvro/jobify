const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});

const generateDescription = async (entityDetails, entityType) => {
    try {
        const prompt = `Generate a detailed description for the following ${entityType}:
    ${JSON.stringify(entityDetails)}`;

        const response = await openai.chat.completions.create({
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
        console.error("Error generating description:", error);
        throw new Error("Failed to generate description");
    }
};

module.exports = generateDescription;
