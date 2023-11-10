import Cookies from "js-cookie";

export const env = {
    API_URL: 'http://localhost:8000/api',
    auth: Cookies.get('auth') !== undefined && JSON.parse(Cookies.get('auth')),
    service_id: 'service_g0hzskm',
    template_id: 'template_dz3w2nj',
    public_key: 'KuS1pQeLU-UxU9Hv9',
    web_url: "http://localhost:3000"
    

}