import api from '@/configs/axios'
import { to } from 'await-to-js';
import serialize from '@/lib/Serializer'

const base = "client"
const basePatient = "patient"

export default {
    getClientList: async () => {
        const [err, data] = await to(
            api.get(`${base}/clientList`)
        )
        return serialize(err ? err.response : data);
    },
    getClientPatients: async (payload) => {
        const [err, data] = await to(
            api.post(`${base}/get/patient/list`, payload)
        )
        return serialize(err ? err.response : data);
    },
    addClientData: async (payload) => {
        const [err, data] = await to(
            api.post(`${base}/generate`, payload)
        )
        return serialize(err ? err.response : data);
    },
    addPatientData: async (payload) => {
        const [err, data] = await to(
            api.post(`${basePatient}/add/new`, payload)
        )
        return serialize(err ? err.response : data);
    },

    patientActionTab: async (payload) => {
        const routeAction = payload.action;
        const tab = payload.tabSelected;

        const [err, data] = await to(
            api.post(`${basePatient}/${routeAction}/${tab}`, payload.params)
        )
        return serialize(err ? err.response : data);
    },
    patientActionDetailTab: async (payload) => {
        const routeAction = payload.action;
        const tab = payload.tabSelected;
        const params = payload.params;

        const [err, data] = await to(
            api.get(`${basePatient}/${routeAction}/${tab}/${params.id}`)
        )
        return serialize(err ? err.response : data);
    },
}