import api from '@/services/api';

export const generateDescription = async (entityDetails: string, entityType: string): Promise<string> => {
    try {
        const response = await api.post('/generate-description', {
            entityDetails,
            entityType,
        });

        if (response.data?.description) {
            return response.data.description;
        } else {
            throw new Error('No description in response');
        }
    } catch (error) {
        console.error('Error generating description:', error);
        throw error;
    }
};
