import axios from 'axios';
import { Dispatch } from 'redux';

export const getJobDescriptions = () => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get('/api/jobs');
        dispatch({
            type: 'FETCH_JOB_DESCRIPTIONS',
            payload: response.data,
        });
    } catch (error) {
        console.error('Error fetching job descriptions', error);
    }
};
