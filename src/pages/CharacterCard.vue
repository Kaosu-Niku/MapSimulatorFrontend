<template>
  <div class="character-card">
    <div class="content">
      <el-image class="head-image" :src="iconUrl" fit="fill"
      @click="join" />
      <div class="name_profession">
        <div class="name">
          {{ characterCurrent.name? characterCurrent.name : "無" }}
        </div>
        <div class="profession">
          {{ characterCurrent.profession? professionConvertChinese(characterCurrent.profession) : "無" }}
        </div>
      </div>      
      <div class="rarity">
        <el-image class="rarity-image" v-for="n in characterCurrent.rarity" :key="n"
        :src="'https://www.citypng.com/public/uploads/preview/white-star-png-img-701751694532296t4i955smo5.png'" fit="fill"/>        
      </div>
      <div class="phase_skill">
        <div class="maxPhase">
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_0_large.png'" fit="fill"
          @click="change_currentPhase(0)" />
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_1_large.png'" fit="fill" 
          @click="change_currentPhase(1)" v-if="characterCurrent.maxPhase > 0"/>
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_2_large.png'" fit="fill" 
          @click="change_currentPhase(2)" v-if="characterCurrent.maxPhase > 1"/>
        </div>
        <div class="skillData">
          <el-image class="skill-image" v-for="skill in characterCurrent.skills" :key="skill.skillId" :src="skillIconUrl(skill.skillId)" fit="fill"
          @click="change_currentSkill(skill.skillId)"/>        
        </div>
      </div>     
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, computed } from "vue";
import GameConfig from "@/components/utilities/GameConfig"; 
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

//請求角色頭像圖片
const iconUrl = computed(() => {
  //GameConfig.BASE_URL = VITE_API_URL (VITE_API_URL是設定後端網址的環境變數)
  //角色頭像的圖檔取自一個提供遊戲原資源解包的Github倉庫: https://github.com/yuanyan3060/ArknightsGameResource/public/avatar/
  //圖檔名稱剛好是角色id，副檔名是png，例如: 陳的精零頭像是 char_010_chen.png、陳的精二頭像是 char_010_chen_2.png 以此類推
  return `${GameConfig.BASE_URL}/avatar/${characterCurrent.value.key}.png`;
});

//將profession轉換為中文表示
function professionConvertChinese(profession){
  switch(profession){
    case "PIONEER":
      return "先锋";
    case "WARRIOR":
      return "近卫";
    case "SNIPER":
      return "狙击";
    case "TANK":
      return "重装";
    case "MEDIC":
      return "医疗";
    case "SUPPORT":
      return "辅助";
    case "CASTER":
      return "术师";
    case "SPECIAL":
      return "特种";
    default:
      return "其它";
  }
}

//請求角色技能圖片
function skillIconUrl (skillId){
  //GameConfig.BASE_URL = VITE_API_URL (VITE_API_URL是設定後端網址的環境變數)
  //角色技能的圖檔取自一個提供遊戲原資源解包的Github倉庫: https://github.com/yuanyan3060/ArknightsGameResource/public/skill/
  //圖檔名稱是 skill_icon_(角色技能id)，副檔名是png，例如: 陳的1技能是 skill_icon_skchr_chen_1.png、陳的2技能是 skill_icon_skchr_chen_2.png 以此類推
  return `${GameConfig.BASE_URL}/skill/skill_icon_${skillId}.png`;
};

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
  justify-content: center;
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
    justify-content: center;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
    .head-image{
      height: 50px;
      width: 50px;
      margin-right: 6px;
    }
    .name_profession{
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
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
    .phase_skill{
      flex: 3;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
    }
    .maxPhase{
      display: flex; 
      flex-wrap: wrap;
      justify-content: space-between;
      .elite-image{    
        margin-right: 5px;  
        height: 30px;
        width: 30px;
      }
    }  
    .skillData{
      display: flex; 
      flex-wrap: wrap;
      justify-content: space-between;
      .skill-image{     
        margin-right: 5px;  
        height: 30px;
        width: 30px;
      }
    } 

  }
}
</style>