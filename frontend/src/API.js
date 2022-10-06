import axios from 'axios'

export default axios.create({
    baseURL: 'http://13.42.72.126:8000/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
}) 