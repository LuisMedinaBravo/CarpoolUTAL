<template>
    <div class="contenedor">

        <div class="buscador">
            <vs-input v-model="search" border placeholder="Buscar" />
        </div>
        <div class="tabla-container">
            <vs-table class="tabla">
                <template #thead>
                    <vs-tr >
                        <vs-th style="background-color: #36568c; color: white;">
                            Codigo
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                            Origen
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                            Destino
                        </vs-th>
                        <vs-th sort @click="viajes = $vs.sortData($event, viajes, 'precio')" style="background-color: #36568c; color: white;">
                            Precio
                        </vs-th>
                        <vs-th style="background-color: #36568c; color: white;">
                            Asientos
                        </vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr :key="i" v-for="(tr, i) in $vs.getSearch(viajes, search)" :data="tr" >
                        <vs-td style=" border: 1px solid #36568c;">
                            {{ tr._id }}
                        </vs-td>
                        <vs-td style="min-width: 200px; border: 1px solid #36568c;">
                            {{ tr.origen.nombre }}
                        </vs-td>
                        <vs-td style="min-width: 200px; border: 1px solid #36568c;">
                            {{ tr.destino.nombre }}
                        </vs-td>
                        <vs-td style="text-align: right; border: 1px solid #36568c;">
                            {{ tr.precio }}
                        </vs-td>
                        <vs-td style="text-align: right; border: 1px solid #36568c;">
                            {{ tr.disponibles }} /4
                        </vs-td>

                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</template>
<script>
import API from '../api';
export default {

    data: () => ({
        page: 1,
        max: 3,
        search: '',
        usuarios: [],
        viajes: [

        ]
    }), mounted() {
        this.cargarviajes()

    }, methods: {
        async cargarviajes() {
            this.viajes = await API.getallviajes()


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