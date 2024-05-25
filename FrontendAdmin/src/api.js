import axios from 'axios'

// TIENEN QUE CAMBIARLO CON SU NETWORK PARA QUE FUNCIONE EN CELU, SINO NO FUNCA XD
/*const url="https://carutalback-wacd334doa-tl.a.run.app/api/"*/
/* const url="http://localhost:8000/api/" */

const url ="https://backend-taller-production-a403.up.railway.app/api/"
export default class API{
    //Añadir usuario
    static async addusuario(data){
        try {
            const res = await axios.post(url+"addusuario",data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
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
            //console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    //LLAMADAS VIAJE
    static async addviaje(data){
        try {
            const res = await axios.post(url+"addviaje",data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
    static async getallusuarios(){
        try {
            const res = await axios.get(url+"getallusuarios")
            //console.log(res.data)
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

    static async getviajesbyid(ID){
        try {
            const res = await axios.get(url+"getviajesbyid/"+ID)
            //console.log(res.data)
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
            const res = await axios.post(url+"addnotificacion",data)
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }

    static async updatePanico(data){
        try {
            const res = await axios.put(url+"updatePanico",data)
            console.log("Update",res.data)
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
    static async getallaudio(){
        try {
            const res = await axios.get(url+"getallaudio")
            console.log(res.data)
            return res.data
        } catch (error) {
            return error.response.data
        }
    }
}