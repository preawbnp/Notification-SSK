<template>
  <div class="hello">
    <div id="app"> </div>
      <div align="center" style="margin-top:50px;">
      <button  id="my-notification-button" style="margin-bottom:50px;align-content: center;text-align:justify;background-color:dodgerblue;display:'none'" >Subscribe</button><br>
      PlayerId: <p id="demo">userID</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
