import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'

const base = "auth"

export default {
    authUserLogin: async (payload) => {
        const [err, data] = await to(
            api.post(`${base}/login`, payload)
        )
        return serialize(err ? err.response : data);
    },
    logoutUser: () => {
        localStorage.clear()
    }
}