<template>
  <div class="character-wave">
    <div class="content">
      <div class="head-rarity">
        <el-image class="head-image" :src="iconUrl" fit="fill" @click="join" /> 
        <div class="rarity">
          <StarFilled class="rarity-image" v-for="n in characterCurrent.rarity" :key="n"/>        
        </div>
      </div>      
      <div class="name_profession">
        <div class="name">
          {{ characterCurrent.name? characterCurrent.name : "無" }}
        </div>
        <div class="profession">
          {{ characterCurrent.profession? professionConvertChinese(characterCurrent.profession) : "無" }}
        </div>
      </div>           
      <div class="phase_skill">
        <div class="maxPhase">
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_0_large.png'" fit="fill"
          :class="{ 'is-active': characterCurrent.currentPhase === 0 }"
          @click="change_currentPhase(0)" />
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_1_large.png'" fit="fill"
          :class="{ 'is-active': characterCurrent.currentPhase === 1 }" 
          @click="change_currentPhase(1)" v-if="characterCurrent.maxPhase > 0"/>
          <el-image class="elite-image" :src="'https://map.ark-nights.com/assets/elite_icons/elite_2_large.png'" fit="fill"
          :class="{ 'is-active': characterCurrent.currentPhase === 2 }" 
          @click="change_currentPhase(2)" v-if="characterCurrent.maxPhase > 1"/>
        </div>
        <div class="skillData">
          <el-image class="skill-image" v-for="skill in characterCurrent.skills" :key="skill.skillId" :src="skillIconUrl(skill.skillId)" fit="fill"
          :class="{ 'is-active': characterCurrent.currentSkillId === skill.skillId }"
          @click="change_currentSkill(skill.skillId)"/>        
        </div>
      </div>     
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, computed } from "vue";
import { StarFilled } from '@element-plus/icons-vue'; //StarFilled = 星星圖案
import GameConfig from "@/components/utilities/GameConfig"; 
const props = defineProps({
  character: {
    type: Object,
    required: true
  }
});

const characterCurrent = ref({ ...props.character });
//設置角色當前選擇的精英階段和當前選擇的技能id，用於與Wave互動
characterCurrent.value.currentPhase = characterCurrent.value.maxPhase;

watch(() => characterCurrent.value.skills, (newSkills) => {
  //由於vue的渲染機制問題，直接對characterCurrent.value.currentSkillId賦值，可能要晚於skill-image渲染並要帶入判斷的時機，以至於只會取得undefind判斷永遠都是false的狀況
  //因此改為用watch監聽的方式來確保賦值
  if (newSkills && newSkills.length > 0) {
    characterCurrent.value.currentSkillId = newSkills?.[0].skillId;
  }
}, { immediate: true });
if(characterCurrent.value.skills.length > 0){
  characterCurrent.value.currentSkillId = characterCurrent.value.skills[characterCurrent.value.skills.length - 1].skillId;
}

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
  //改變當前選擇的精英階段
  characterCurrent.value.currentPhase = i;
}

function change_currentSkill(skillId){
  //改變所選技能
  characterCurrent.value.currentSkillId = skillId;
  //如果當前選擇的精英階段不是精2，且選擇3技能，就將所選技能替換成1技能 (遊戲中未精2就沒有3技能)
  let currentSkillIndex = characterCurrent.value.skills.findIndex(skill => skill.skillId === skillId);
  if(characterCurrent.value.currentPhase != 2 && currentSkillIndex == 2){
    characterCurrent.value.currentSkillId = characterCurrent.value.skills[0].skillId;
  }
}

function join(){
  //頭像圖片被點擊的角色加入部屬區
  alert(characterCurrent);
}

</script>

<style lang="scss" scoped>
.character-wave{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; //可防止因為有太多item而被壓縮空間
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
    .head-rarity{
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .head-image{
      height: 50px;
      width: 50px;
      margin-right: 6px;
    }
    .name_profession{
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    .rarity{
      flex: 1;
      display: flex; 
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      .rarity-image{
        margin-top: 1px;
        margin-bottom: 1px;
        width: 15px;
      }
    }
    .phase_skill{
      flex: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
    }
    .maxPhase{
      display: flex; 
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .elite-image{    
        margin-right: 5px;  
        width: 30px;
      }
      .elite-image.is-active {
        padding: 1px;
        box-shadow: 0 0 10px yellow;
        filter: brightness(2); //稍微提高亮度
      }
    }  
    .skillData{
      display: flex; 
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .skill-image{     
        margin-right: 5px;  
        height: 30px;
        width: 30px;
      }
      .skill-image.is-active {
        padding: 1px;
        box-shadow: 0 0 10px yellow;
      }
    } 

  }
}
</style>