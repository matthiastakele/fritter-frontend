<!-- Reusable component representing a single like and its actions -->

<template>
  <span class="rectangle" @click = "changeAlbumChosen" :style= "{'background-color': $store.state.albumChosen === album ? 'rgb(153, 153, 255)' : '#f8f8f8'}" > 
   <p style = "font-size: 25px;">{{album.name}}</p>
  </span>
</template>

<script>
export default {
  name: "AlbumComponent",
  props: {
    // Data from the stored freet
    album: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    };
  },
  async created() {
  },
  methods: {
    changeAlbumChosen(){
      this.$store.commit('setAlbumChosen', this.album);
    }
  },
};
</script>

<style scoped>
@import "/components/global_css.css";

.rectangle {
  height: 125px;
  width: 125px;
  color: #353535;
  background-color: rgb(153, 153, 255);
  border: 1px solid #ccc;
  border-radius:7px;
  display: flex;
  font-size: large;
  justify-content:center;
  align-items: center;
}

</style>
