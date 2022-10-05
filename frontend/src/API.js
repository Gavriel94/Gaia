import axios from 'axios'

export default axios.create({
    baseURL: 'http://3.11.212.147:8000/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
}) 