<script lang="ts" setup>
import { ref } from 'vue';
import Menu from '@/pages/Menu.vue';
import Game from "@/pages/Game.vue";
import MemberMenu from '@/pages/MemberMenu.vue';

const game = ref();
const handleChangeStage = (map: any) => {
  game.value.newGame(map);
}

</script>

<template>
<div class="index">
  <Menu  @changeStage = "handleChangeStage"/>
  <Game 
    ref="game"
  />
  <MemberMenu />
</div>
  
</template>

<style scoped>
.index{
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}
#c{
  display: block;
  position: fixed;
}
</style>
