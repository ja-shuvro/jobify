interface JobState {
    jobDescriptions: any[];
}

const initialState: JobState = {
    jobDescriptions: [],
};

export const jobReducer = (state = initialState, action: any): JobState => {
    switch (action.type) {
        case 'FETCH_JOB_DESCRIPTIONS':
            return {
                ...state,
                jobDescriptions: action.payload,
            };
        default:
            return state;
    }
};
