<template>
    <div>
      <vs-select v-model="selectedBrand" class="mb-4" v-if="auto">
        <vs-option v-for="car in auto" :key="car.marca" :label="car.marca" :value="car.marca">{{ car.marca }}</vs-option>
      </vs-select>
  
      <vs-select v-model="selectedModel" v-if="selectedBrand" :key="selectedBrand">
        <vs-option v-for="model in selectedBrandModels" :key="model" :label="model" :value="model">{{ model }}</vs-option>
      </vs-select>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        selectedBrand: '',
        selectedModel: '',
        auto: [
                {
                    marca: "Toyota",
                    modelos: ["Corolla", "Camry", "Rav4", "Yaris", "Prius"]
                },
                {
                    marca: "Honda",
                    modelos: ["Civic", "Accord", "CR-V", "Pilot", "Fit"]
                },
                {
                    marca: "Ford",
                    modelos: ["Mustang", "F-150", "Explorer", "Escape", "Focus"]
                },
                {
                    marca: "Chevrolet",
                    modelos: ["Cruze", "Malibu", "Equinox", "Traverse", "Tahoe"]
                },
                {
                    marca: "Volkswagen",
                    modelos: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas"]
                },
                {
                    marca: "Nissan",
                    modelos: ["Sentra", "Altima", "Maxima", "Rogue", "Pathfinder"]
                },
                {
                    marca: "Hyundai",
                    modelos: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"]
                },
                {
                    marca: "BMW",
                    modelos: ["3 Series", "5 Series", "X3", "X5", "7 Series"]
                },
                {
                    marca: "Mercedes-Benz",
                    modelos: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"]
                },
                {
                    marca: "Audi",
                    modelos: ["A4", "A6", "Q5", "Q7", "TT"]
                },
                {
                    marca: "Lexus",
                    modelos: ["IS", "ES", "RX", "NX", "LS"]
                },
                {
                    marca: "Mazda",
                    modelos: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata"]
                },
                {
                    marca: "Subaru",
                    modelos: ["Impreza", "Legacy", "Forester", "Outback", "WRX"]
                },
                {
                    marca: "Kia",
                    modelos: ["Forte", "Optima", "Sorento", "Sportage", "Stinger"]
                },
                {
                    marca: "Tesla",
                    modelos: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"]
                },
                {
                    marca: "Volvo",
                    modelos: ["S60", "S90", "XC40", "XC60", "XC90"]
                },
                {
                    marca: "Land Rover",
                    modelos: ["Range Rover Evoque", "Range Rover Sport", "Discovery", "Defender", "Velar"]
                },
                {
                    marca: "Jaguar",
                    modelos: ["XE", "XF", "F-PACE", "E-PACE", "I-PACE"]
                },
                {
                    marca: "Porsche",
                    modelos: ["911", "Panamera", "Cayenne", "Macan", "Taycan"]
                },
                {
                    marca: "Ferrari",
                    modelos: ["488 GTB", "F8 Tributo", "812 Superfast", "SF90 Stradale", "Portofino"]
                },
                {
                    marca: "Lamborghini",
                    modelos: ["Aventador", "Huracan", "Urus", "Sián", "Veneno"]
                },
                {
                    marca: "Otro",
                    modelos: ["Otro"]
                },
            ],
      };
    },
    computed: {
      selectedBrandModels() {
        if (this.selectedBrand) {
          const car = this.auto.find(car => car.marca === this.selectedBrand);
          return car ? car.modelos : [];
        }
        return [];
      },
    },
  };
  </script>
  
  <style scoped>
  .mb-4 {
    margin-bottom: 1rem;
  }
  </style>
  