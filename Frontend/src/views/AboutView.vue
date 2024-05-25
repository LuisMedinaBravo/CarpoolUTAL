<template>
  <div class="accordion">
    <div class="accordion-item" v-for="(item, index) in items" :key="index">
      <div class="accordion-header" @click="toggleItem(index)">
        {{ item.title }}
      </div>
      <div class="accordion-content" :class="{ 'active': activeIndex == index }">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Pregunta 1',
          content: 'Respuesta 1'
        },
        {
          title: 'Pregunta 2',
          content: 'Respuesta 2'
        },
        {
          title: 'Pregunta 3',
          content: 'Respuesta 3'
        }
      ],
      activeIndex: null
    };
  },
  methods: {
    toggleItem(index) {
      if (this.activeIndex == index) {
        this.activeIndex = null;
      } else {
        this.activeIndex = index;
      }
    }
  }
};
</script>


<style>
.accordion {
  width: 100%;
}

.accordion-item {
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.accordion-header {
  background-color: #f2f2f2;
  padding: 10px;
  cursor: pointer;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.accordion-content.active {
  max-height: 20px; /* Altura máxima de la sección abierta */
}

</style>
