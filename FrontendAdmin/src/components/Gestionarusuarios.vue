<template>
    <div class="contenedor">
        <div class="buscador">
            <vs-input success v-model="search" border placeholder="Buscar" />
        </div>
        <div class="tabla-container">
            <vs-table class="tabla">
                <template #thead>
                    <vs-tr>
                        <vs-th style="background-color: #36568c; color: white;">
                            Nombre
                        </vs-th>

                        <vs-th style="background-color: #36568c; color: white;">
                            Actividad
                        </vs-th>

                        <vs-th style="background-color: #36568c; color: white;">
                            Correo
                        </vs-th>

                        <vs-th style="background-color: #36568c; color: white;">
                            Es chofer?
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                            Pantente
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                            Marca
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                           Modelo
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                           Boton de panico
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                           Resetear boton panico
                        </vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr :key="i" v-for="(tr, i) in $vs.getSearch(usuarios, search)" :data="tr">
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.nombre }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.actividad }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.correo }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            <p  style="margin: 0; text-align: center;" v-if="tr.eschofer">
                                Si
                            </p>
                            <p v-else style="margin: 0; text-align: center;">No</p>
                            
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.vehiculo.patente }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.vehiculo.marca }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.vehiculo.modelo }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            {{ tr.panico }}
                        </vs-td>
                        <vs-td style="border: 1px solid #36568c;">
                            <vs-button color="primary" @click="mostrarDialogo(tr)" :disabled="tr.panico=='No'">Resetear</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <vs-dialog v-model="showDialog">
            <div class="dialog-content">
                <h3>¿Estas seguro que quieres resetearlo?</h3>
                <p>Recuerda que una vez que inicie el proceso, el usuario podra volver a realizar viajes.</p>
            </div>
            <div class="dialog-footer">
                <vs-button success transparent @click="resetearPanico">Aceptar</vs-button>
                <vs-button dark transparent @click="showDialog = false">Rechazar</vs-button>
            </div>
        </vs-dialog>
    </div>
</template>
<script>
import API from '../api';
export default {

    data: () => ({
        page: 1,
        max: 10,
        search: '',
        usuarios: [],
        infoVehiculo: false,
        showDialog: null,
        resetUser:null,
    }), mounted() {
        this.cargarusuarios()

    }, methods: {
        async resetearPanico(){
            const loading = this.$vs.loading({
                type: 'default'
            })
            var dataPanico={
                userid:this.resetUser._id,
                panico:0
            }
            await API.updatePanico(dataPanico)
            await this.cargarusuarios()
            this.showDialog = false
            loading.close()
        },
        mostrarDialogo(tr) {
            this.showDialog = true
            this.resetUser=tr
        },
        async cargarusuarios() {
            var todosusuarios = await API.getallusuarios()
            todosusuarios.forEach(element => {
                if(element.contPanico==0){
                    element.panico = "No"
                }else{
                    element.panico = "Si"
                }
            });
            console.log(todosusuarios)
            this.usuarios = todosusuarios
            console.log(this.usuarios)
        }
    }
}
</script>
<style scoped>
.contenedor {
    display: flex;
    flex-direction: column;
    /* Centra verticalmente el contenido */
    height: 94vh;
    /* Establece la altura del contenedor en la altura de su contenedor padre */
    width: 100%;

}
.perfil {
    display: flex;
    justify-content: center;

}

.perfil .vs-avatar img {

    width: 100px;
    height: 100%;
}

.tabla-container {

    width: 100%;
    height: 90%;
    /* La tabla ocupa todo el espacio disponible */
}

.tabla {
    width: 100%;

}

.paginacion {
    position: relative;
    bottom: 0;
    background-color: #36568c;
    color: white;
    width: 100%;
}

.buscador {
    position: relative;
    width: 100%;
}
</style>