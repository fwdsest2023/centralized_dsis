import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'


const base = "product"

export default {
    getProductList: async () => {
        const [err, data] = await to(
            api.post(`${base}/get/products`)
        )
        return serialize(err ? err.response : data);
    },
    
    addNewProduct: async (payload) => {
        const [err, data] = await to(
            api.post(`${base}/add/new`, payload)
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