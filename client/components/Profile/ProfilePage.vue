<!-- Default page that also displays freets -->

<template>
  <main>
    <span class="profilePic">{{this.username.charAt(0).toUpperCase()}}</span>
    <h3 style = "margin-left: 2%;">@{{this.username}}</h3>
    <h4 style = "margin-left: 2%;">{{this.followers}} Followers  &nbsp; {{this.following}} Following</h4>
      <div class="options">
        <button class = "pretty_button options_item" @click="chooseFreets" :style= "{'background-color': chosen == 'freets' ? 'rgb(153, 153, 255)' : '#f8f8f8'}">
          Freets
        </button>
        <button class = "pretty_button options_item" @click="chooseLikes" :style= "{'background-color': chosen == 'likes' ? 'rgb(153, 153, 255)' : '#f8f8f8'}">
          Likes
        </button>
        <button class = "pretty_button options_item" @click="chooseAlbums" :style= "{'background-color': chosen == 'albums' ? 'rgb(153, 153, 255)' : '#f8f8f8'}">
          Albums
        </button>
      </div>
    <section v-if="chosen == 'freets'">
      <section
        v-if="$store.state.freets.length"
      >
      <div class="reverseorder">
        <FreetComponent
          v-for="freet in $store.state.profileFreets"
          :key="freet.id"
          :freet="freet"
        />
      </div>
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>

    <section v-if="chosen == 'likes'">
      <div class="reverseorder">
      <FreetComponent
          v-for="freet in $store.state.likes"
          :key="freet.id"
          :freet="freet"
        />
      </div>
    </section>

    <section v-if="chosen == 'albums'">
      <div class="row">
        <div class = "column" style = "gap: 10%;">
          <form style = "margin-left: 3%; font-weight: 600;" v-on:submit="addAlbum">
            <label for="albumName">Add New Album:</label><br>
            <input type="text" v-model="addAlbumName" name="newAlbumName" value=""><br>
            <button class = "pretty_button" type="submit">Add</button>
          </form>

          <form style = "margin-left: 3%; margin-top: 5%; font-weight: 600;" v-on:submit="deleteAlbum">
            <label for="albumName">Delete an Album:</label><br>
            <input type="text" v-model="deleteAlbumName" name="newAlbumName" value=""><br>
            <button class = "pretty_button" type="submit">Delete</button>
          </form>
        </div>
       <!-- <form style = "margin-left: 2%; font-weight: 600;" onsubmit="return addAlbum()" >
          <label for="albumName">Add New Album:</label><br>
          <input type="text" id="albumName" name="albumName" value=""><br>
          <input class = "pretty_button" type="submit" value="Submit">
       </form>  -->
       <div class = "column" style = "margin-right: 30%;">
          <div class="grid-container">
            <AlbumComponent class = "grid-item"
                v-for="album in $store.state.albums"
                :key="album.id"
                :album="album"
              />
          </div>
          <button style = "margin-left: 22.5%; margin-top: 10%;"  class = "pretty_button" @click = "viewAlbumFreets">View Selected Album Freets</button>
        </div>
      </div>
      <FreetComponent v-if="view"
            v-for="freet in this.albumChosenFreets"
            :key="freet.id"
            :freet="freet"
          />
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import AlbumComponent from '@/components/Album/AlbumComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, AlbumComponent},
  data() {
    return {
      chosen: "freets",
      userId: null,
      username: this.$store.state.profileUsername,
      followers: null,
      following: null,
      display: "",
      albumChosenFreets: [],
      view: false,
      addAlbumName: null,
      deleteAlbumName: null,
      deleteAlbumId : null
    };
  },
  async created() {
    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    let r = await fetch(`/api/users/userIds/${this.$store.state.profileUsername}`, options);
    let res = await r.json();
    this.userId = res.userId;

    r = await fetch(`/api/follows/${this.userId}/followers`, options);
    res = await r.json();
    this.followers = res.followers.length;

    r = await fetch(`/api/follows/${this.userId}/following`, options);
    res = await r.json();
    this.following = res.following.length;
  },
  methods: {
    chooseFreets(){
      this.chosen = "freets";
      this.$store.commit('refreshFreets');
      this.view = false;
    },
    chooseLikes(){
      if(this.freetsChosen){
        this.$store.commit('refreshLikes', this.userId);
      }
      this.chosen = "likes";
      this.view = false;
    },
    chooseAlbums(){
      this.chosen = "albums";
      this.$store.commit('refreshAlbums');
      this.$store.commit('setAlbumChosen', []);
    },
    viewAlbumFreets(){
      this.view = true;
      let freetIds = this.$store.state.albumChosen.freets;
      this.albumChosenFreets = this.$store.state.freets.filter(function (freet) {
        return freetIds.includes(freet._id);
      });
    },
    async addAlbum(){
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumName: this.addAlbumName }),
      };
      await fetch(`/api/albums`, options);
      this.$store.commit('refreshAlbums');
    },
    async deleteAlbum(){
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      };
      const name = this.deleteAlbumName;
      const obj = this.$store.state.albums.filter(function (album) {
        return album.name === name;
      });
      this.deleteAlbumId = obj[0]._id;
      await fetch(`/api/albums/${this.deleteAlbumId}`, options);
      this.$store.commit('refreshAlbums');
    }
  }
};
</script>

<style scoped>
@import "/components/global_css.css";
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.reverseorder {
  display: flex;
  flex-direction: column-reverse;
}
.options {
  display: flex;
  margin: 10px -30px;
  justify-content: center;
}
.options_item {
  margin: 10px 30px;
  /* background-color: rgb(153, 153, 255); */
  font-size: 1em;
}
span.profilePic{
  background: rgb(153, 153, 255);
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  color: #353535;
  display: inline-block;
  font-weight: bold;
  font-size: 40px;
  line-height: 75px;
  margin-left: 2%;
  margin-top: 2%;
  text-align: center;
  width: 75px;
}

.grid-container {
  margin-top: 20px;
  display: grid;
  justify-content: center;
  align-content: center;
  gap: 75px;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr;
}
.grid-item {
  font-size: 20px;
  text-align: center;
}
.column {
  float: left;
  width: 40%;
}

/* Clear floats after the columns */
.row {
  display: flex;
}
</style>
