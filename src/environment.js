import axios from "axios"

export const env = {
    API_URL: 'http://localhost:8000/api',
    auth: JSON.parse(localStorage.getItem('auth')),
    service_id: 'service_g0hzskm',
    template_id: 'template_dz3w2nj',
    public_key: 'KuS1pQeLU-UxU9Hv9'

}

export const getform = () =>
    axios({ method: "GET", url: env.API_URL + "/getform", headers: { "x-access-token": env.auth.accessToken } })
    .then(res => res.data.survey).catch(err => err)