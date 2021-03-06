import axios from 'axios';

export const GET_OPERATOR = 'GET_OPERATOR';

export const getOperator = () => dispatch => {
    return axios.post(`http://${process.env.REACT_APP_API_URL || 'localhost'}:3028/operator`)
        .then(response => {
            dispatch({ type: GET_OPERATOR, response: response.data.message });
            return response.data.message;
        })
        .catch(err => err.response.data.message);
}
