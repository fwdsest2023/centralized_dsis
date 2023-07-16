import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'

const base = "users"
const baseMob = "mobile"

export default {
    getAgentList: async () => {
        const [err, data] = await to(
            api.get(`${base}/getAgents`)
        )
        return serialize(err ? err.response : data);
    },
    
    getClientList: async (payload) => {
        const [err, data] = await to(
            api.post(`${baseMob}/client/list`, payload)
        )
        return serialize(err ? err.response : data);
    },

    getAgentSummaryList: async (payload) => {
        const [err, data] = await to(
            api.post(`${baseMob}/agent/callSummary`, payload)
        )
        return serialize(err ? err.response : data);
    },
    
}