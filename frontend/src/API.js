import axios from 'axios'

export default axios.create({
    baseURL: 'http://18.130.61.179:8000/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
}) 