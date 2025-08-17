<script lang="ts" setup>
import { ref } from 'vue';
import Menu from '@/pages/Menu.vue';
import Game from "@/pages/Game.vue";
import CharacterMenu from '@/pages/CharacterMenu.vue';



const game = ref();
const handleChangeStage = (map: any) => {
  map.predefines.characterCards = chooseCharacters;
  game.value.newGame(map);
}

const chooseCharacters = [];
const handleChooseCharacter = (character: any) => {
  chooseCharacters.push(character);
}

</script>

<template>
<div class="index">
  <Menu  @changeStage = "handleChangeStage"/>
  <Game 
    ref="game"
  />
  <CharacterMenu @chooseCharacter = "handleChooseCharacter"/>
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
