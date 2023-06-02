import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'

const base = "dashboard"

export default {
    getScheduleList: async () => {
        const [err, data] = await to(
            api.get(`${base}/getScheduleList`)
        )
        return serialize(err ? err.response : data);
    },
}