<template>
  <div class="character-card">
    <div class="content">
      <el-image class="head-image" :src="characterCurrent.icon" fit="fill"
      @click="join" />
      <div class="name">
        {{ characterCurrent.name? characterCurrent.name : "無" }}
      </div>
      <div class="profession">
        {{ characterCurrent.profession? characterCurrent.profession : "無" }}
      </div>
      <div class="rarity">
        <el-image class="rarity-image" v-for="n in characterCurrent.rarity" :key="n"
        :src="'https://www.citypng.com/public/uploads/preview/white-star-png-img-701751694532296t4i955smo5.png'" fit="fill"/>        
      </div>
      <div class="maxPhase">
        <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_0_large.png'" fit="fill"
        @click="change_currentPhase(0)" />
        <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_1_large.png'" fit="fill" 
        @click="change_currentPhase(1)" v-if="characterCurrent.maxPhase > 0"/>
        <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_2_large.png'" fit="fill" 
        @click="change_currentPhase(2)" v-if="characterCurrent.maxPhase > 1"/>
      </div>
      <div class="skillData">
        <el-image class="skill-image" v-for="n in characterCurrent.skillData.icon" :key="n" :src="n" fit="fill"
        @click="change_currentSkill(n)"/>        
      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from "vue";
const props = defineProps({
  character: {
    type: Object,
    required: true
  }
});

//使用深層複製來避免引用原數據而導致同步修改 (需注意此深層複製方式無法複製undefined、function())
const originalCharacterData = JSON.parse(JSON.stringify(props.character));
const characterCurrent = ref(originalCharacterData);
characterCurrent.value.currentPhase = 0;

function change_currentPhase(i){
  const originalSkillData = JSON.parse(JSON.stringify(props.character.skillData));
  //改變所選精英階段
  characterCurrent.value.currentPhase = i;
  //(改變攻擊範圍、改變可選技能)
  characterCurrent.value.skillData = JSON.parse(JSON.stringify(originalSkillData));
  //如果這是有三技能的幹員，且當前所選精英階段不是精2，就移除最後一個技能的資訊
  if(characterCurrent.value.skillData.icon.length == 3 && i != 2){
    characterCurrent.value.skillData.icon.pop();
  } 
}

function change_currentSkill(i){
  //改變所選技能
  
}

function join(){
  //頭像被點擊的幹員加入部屬區
  alert(characterCurrent);
}

</script>

<style lang="scss" scoped>
.character-card{
  display: flex;
  align-items: center;
  height: 100px;
  width: 100%;
  margin-bottom: 6px;
  background-color: #909399;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  color: #fff; 
  
  &:hover{
    background-color: #b1b3b8;  
  }
  &.active{
    background-color: #fff;
    color: #000;
    border: 2px solid #b88b8b;

  }
  .content{       
    flex: 1;   
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
    .head-image{
      height: 50px;
      width: 50px;
      margin-right: 6px;
    }
    .name{
      flex: 1;
    }
    .profession{
      flex: 1;
    }
    .rarity{
      flex: 1;
      display: flex; 
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      .rarity-image{
        margin-top: 1px;
        margin-bottom: 1px;
        height: 12px;
        width: 12px;
      }
    }
    .maxPhase{
      flex: 1;
      display: flex; 
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      .elite-image{    
        margin-top: 2px;
        margin-bottom: 2px;    
        height: 25px;
        width: 25px;
      }
    }  
    .skillData{
      flex: 1;
      display: flex; 
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      .skill-image{     
        margin-top: 2px;
        margin-bottom: 2px;   
        height: 25px;
        width: 25px;
      }
    } 

  }
}
</style>