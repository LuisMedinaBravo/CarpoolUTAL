<template>
    <section>
        <div class="form-box" style="margin: 0 auto; text-align: center;">
            <div class="form-value">
                <form action="">
                    <h2>Iniciar sesión</h2>
                    <div class="inputbox">
                        <input type="text" name="" id="" required v-model="mail" style="color: 	#4B4B4B;">
                        <label for="">Correo</label>
                    </div>
                    <div class="inputbox">
                        <input type="password" name="" id="" required v-model="password" style="color: 	#4B4B4B;">
                        <label for="">Contraseña</label>
                    </div>
                    <div class="forget">
                        <label for=""></label>
                    </div>
                    <button @click="login" style="color: white">Ingresar</button>
                    <div class="register">
                        <p style="color:#4B4B4B;">¿No tienes cuenta?, <a href="#" style="color:#4B4B4B;">Pide tu cuenta
                                AQUI</a></p>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
import API from '../api';
// template de un script
export default {
    name: 'Login',
    data() {
        return {
            mail: null,
            password: '',
            hasVisiblePassword: false,
        };
    },
    methods: {
        async login() {
            // verificar el ER del mail y contraseña
            if (/^[A-Za-z0-9._%+-]+@(alumnos.)?utalca.cl$/.test(this.mail)) {
                console.log("La dirección de email UTALCA" + this.mail + " es correcta.");
                console.log("Mail: " + this.mail)
                console.log("Contraseña: " + this.password)
                const resp = await API.login({correo: this.mail,contraseña: this.password})
                if(resp!=false){
                    console.log("Respuesta: " + resp)
                    localStorage.setItem('carpooltoken', resp._id);
                }else{
                    console.log("Respuesta: " + resp)
                    alert("Usuario o contraseña incorrectos")
                }
            } else {
                console.log("La dirección de email UTALCA" + this.mai + " es incorrecta xdxddx.");
            }
        },

    },
    computed: {
        getProgress() {
            let progress = 0

            // at least one number

            if (/\d/.test(this.password)) {
                progress += 20
            }

            // at least one capital letter

            if (/(.*[A-Z].*)/.test(this.password)) {
                progress += 20
            }

            // at menons a lowercase

            if (/(.*[a-z].*)/.test(this.password)) {
                progress += 20
            }

            // more than 5 digits

            if (this.password.length >= 6) {
                progress += 20
            }

            // at least one special character

            if (/[^A-Za-z0-9]/.test(this.password)) {
                progress += 20
            }

            return progress
        }
    }
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

* {
    margin: 0;
    padding: 0;
    font-family: 'poppins', sans-serif;
}

section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;

    /* background: url('../assets/wallpaperflare.com_wallpaper.jpg')no-repeat; */
    background-position: center;
    background-size: cover;
}

.form-box {
    position: relative;
    width: 350px;
    height: 400px;
    background: transparent;
    border: 2px solid #36568c;
    border-radius: 20px;
    backdrop-filter: blur(15px);
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../assets/logo.jpg') no-repeat;
    background-size: contain;
    background-position: -800% center;
    /* Comienza desde la izquierda */
    background-color: rgba(255, 255, 255, 0.6);
    /* blanco con 50% de opacidad */
    background-blend-mode: overlay;
    animation: deslizarImagen 1.5s forwards;
    /* Agregar "forwards" para mantener el último estado de la animación */
}

@keyframes deslizarImagen {
    0% {
        background-position: -8000% center;
    }

    100% {
        background-position: -480% center;
    }
}

h2 {
    font-size: 2em;
    color: #36568c;
    text-align: center;
}

.inputbox {
    position: relative;
    margin: 30px 0;
    width: 310px;
    border-bottom: 2px solid #36568c;
}

.inputbox label {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    color: #36568c;
    font-size: 1em;
    pointer-events: none;
    transition: .5s;
}

input:focus~label,
input:valid~label {
    top: -5px;
}

.inputbox input {
    width: 100%;
    height: 50px;
    background: transparent;
    border: white;
    outline: bla;
    font-size: 1em;
    padding: 0 35px 0 5px;
    color: black;
}

.inputbox ion-icon {
    position: absolute;
    right: 8px;
    color: #fff;
    font-size: 1.2em;
    top: 20px;
}

.forget {
    margin: -15px 0 15px;
    font-size: .9em;
    color: #fff;
    display: flex;
    justify-content: space-between;
}

.forget label input {
    margin-right: 3px;

}

.forget label a {
    color: #fff;
    text-decoration: none;
}

.forget label a:hover {
    text-decoration: underline;
}

button {
    width: 100%;
    height: 40px;
    border-radius: 40px;
    background: #f79034;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
}

.register {
    font-size: .9em;
    color: black;
    text-align: center;
    margin: 25px 0 10px;
}

.register p a {
    text-decoration: none;
    color: black;
    font-weight: 600;
}

.register p a:hover {
    text-decoration: underline;
}
</style>