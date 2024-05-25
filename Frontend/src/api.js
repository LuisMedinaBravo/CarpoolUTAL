import axios from 'axios'

 // TIENEN QUE CAMBIARLO CON SU NETWORK PARA QUE FUNCIONE EN CELU, SINO NO FUNCA XD

/*  const url="http://localhost:8000/api/"  */
const url ="https://backend-taller-production-a403.up.railway.app/api/"


export default class API{

    //LLAMADAS USUARIO
    static async login(data){
        try {
            const res = await axios.post(url+"login",data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async getuserbyid(ID){
        try {
            const res = await axios.get(url+"getuserbyid/"+ID)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    //LLAMADAS VIAJE
    static async addviaje(data){
        try {
            const res = await axios.post(url+"addviaje",data)
            //console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async addpasajeroviaje(data){
        try {
            const res = await axios.put(url+"agregarpasajero",data)
            
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async changeStateViajebyid(data){
        try {
            const res = await axios.put(url + "cambiarEstado", data);
            //console.log(res.data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async updatePasajerosViaje(data){
        try {
            const res = await axios.put(url + "cambiarPasajeros", data);
            //console.log(res.data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async updateNumAsientos(data){
        try {
            const res = await axios.put(url + "cambiarAsientos", data);
            //console.log(res.data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async getallviajes(){
        try {
            const res = await axios.get(url+"getallviajes")
            //console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    // Añadir el viaje al usuario
    static async addViajeUser(id, data){
        try {
            const res = await axios.put(url+"getallviajes"+id, data)
            //console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async addFotoPerfil(data){
        try {
            const res = await axios.put(url+"updatefotoperfil", data)
            console.log(data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async addFotoAuto(data){
        try {
            const res = await axios.put(url+"updatefotoauto", data)
            console.log(data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async getviajebyid(ID){
        try {
            const res = await axios.get(url+"getviajebyid/"+ID)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async getallnotificaciones(){
        try {
            const res = await axios.get(url+"getallnotificaciones")
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async addNotificacion(data){
        try {
            console.log("DATA API",data)
            const res = await axios.post(url+"addnotificacion",data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
     static async actualizarEstadoNotificacion(data) {
        try {
            const res = await axios.put(url + "cambioEstado", data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
    // chat
    static async agregarMensajeChat(data) {
        try {
            const res = await axios.put(url + "mensajechat", data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
     // chat
    static async addCalificacion(data) {
        try {
            const res = await axios.post(url + "addcalificacion", data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
     // chat
     static async getcalificacionbychofer(ID) {
        try {
            console.log(ID)
            const res = await axios.get(url+"getcalificacionbychofer/"+ID);
            console.log(res.data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
    // Noti
    static async updateTipo(data){
        try {
            const res = await axios.put(url+"cambioTipo",data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    // Noti
    static async updateVisto(data){
        try {
            const res = await axios.put(url+"cambioVisto",data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    //audio
    static async addaudio(data) {
        try {
            const res = await axios.post(url + "addaudio", data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

    static async getallaudio(){
        try {
            const res = await axios.get(url+"getallaudio")
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async addnumcontacto(data){
        try {
            const res = await axios.put(url+"updatenumcontacto", data)
            console.log(data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async addContPanic(data){
        try {
            const res = await axios.put(url+"updatepanic", data)
            console.log(data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
}
