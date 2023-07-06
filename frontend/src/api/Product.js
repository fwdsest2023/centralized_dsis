import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'


const base = "product"
const baseProductList = "get"

export default {
    getProductList: async () => {
        const [err, data] = await to(
            api.post(`${base}/get/products`)
        )
        return serialize(err ? err.response : data);
    },
    
    
    // getProductList: async (payload) => {
    //     const [err, data] = await to(
    //         api.post(`${baseMob}/client/list`, payload)
    //     )
    //     return serialize(err ? err.response : data);
    // },
    
}