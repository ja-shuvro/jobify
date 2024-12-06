import axios from 'axios';

const aiApi = axios.create({
    baseURL: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
    headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    },
});

export const generateJobDescription = async (jobTitle: string): Promise<string> => {
    try {
        const response = await aiApi.post('', {
            prompt: `Generate a job description for a position called ${jobTitle}`,
            max_tokens: 200,
        });
        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error generating job description', error);
        return '';
    }
};
