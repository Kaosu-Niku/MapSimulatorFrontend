<template>
  <div>

    <el-button 
      type="info" 
      @click="characterMenuShow = true"
      class="character-fixed-icon" 
    >
      <el-icon >
        <View />
      </el-icon>
    </el-button>

    <transition> 

    <div
      class="character-menu"
      v-show="characterMenuShow"
    >
      <div class="icons">
        <el-button type="info" @click="characterMenuShow = false">
          <el-icon >
            <Hide />
          </el-icon>
        </el-button>       
      </div>  
      
      <CharacterSelect @chooseCharacter = "handleChooseCharacter"/>
    </div>

    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import CharacterSelect from "./CharacterSelect.vue"

//指定可以接收的子元件emit回傳
const emit = defineEmits<{
  (e: 'chooseCharacter', character: any): void
}>()

//CharacterSelect元件觸發chooseCharacter的emit回傳時執行
const handleChooseCharacter = (character: any) => {
  emit("chooseCharacter", character);
}

const characterMenuShow = ref(true);
</script>

<style scoped lang="scss">
.character-menu{ 
  position: relative;
  z-index: 100;
  height: 100%;
  width: 350px;
  display: flex;
  flex-direction: column;
  .icons{
    padding-top: 6px;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #545c64;
    .el-icon{
      font-size: 24px;
    }
  }
}

.character-fixed-icon{
  top: 6px;
  right: 20px;
  z-index: 10;
  font-size: 24px;
  position: fixed;
}

.v-enter-from,
.v-leave-to{
  width: 0;
}

.v-enter-to,
.v-leave-from{
  width: 330px;
}

.v-enter-active,
.v-leave-active{
  transition: all 0.4s;
}
</style>
