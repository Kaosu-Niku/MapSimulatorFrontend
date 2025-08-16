<template>
  <div class="character-menu">
    <CharacterWave 
      v-for="(character) in characters"
      :character=character
      @chooseCharacter = "handleChooseCharacter"
    />
  </div>
  
</template>

<script lang="ts" setup>
import request from "../api/request"
import { ref, watch, onMounted } from "vue";
import CharacterWave from "./CharacterWave.vue"
import GameConfig from "@/components/utilities/GameConfig"; 

//指定可以接收的子元件emit回傳
const emit = defineEmits<{
  (e: 'chooseCharacter', character: any): void
}>()

//CharacterWave元件觸發chooseCharacter的emit回傳時執行
const handleChooseCharacter = (character: any) => {
  emit("chooseCharacter", character);
}

interface CharacterRef{
  key: string, //請求的角色Id
  //phasesLevel: number, //請求的角色精英階級 (0 = 精零、1 = 精一、2 = 精二)
  //skillId: string, //請求的角色技能Id
}

//獲取全角色ID的請求API
const getCharacterIDs = () => {
  return request({
    method: "post",
    url: "/character/id",
    data: {}
  })
}

//獲取角色資料的請求API
const getCharacterData = (characterRefs: CharacterRef[]) => {
  return request({
    method: "post",
    url: "/character/data",
    data: {
      characterRefs
    }
  })
}

const characters = ref<Array<any>>([]);

onMounted(async () => { 
  try{
    const res: any = await getCharacterIDs();
    const characterIDs = res.data.CharacterIDs;console.log('全角色ID',characterIDs);

    let characterRefs: CharacterRef[] = [];
    characterIDs.forEach((id) => {
      characterRefs.push({
        key: id,
      })
    });

    const res2: any = await getCharacterData(characterRefs);
    const characterDatas = res2.data.CharacterDatas;console.log('全角色資料',characterDatas);

    const CharacterGroup = characterDatas
    .map((character) => {
      return {
        //id
        key: character.key,
        //名稱
        name: character.name, 
        //頭像資源URL
        //GameConfig.BASE_URL = VITE_API_URL (VITE_API_URL是設定後端網址的環境變數)
        //角色頭像的圖檔取自一個提供遊戲原資源解包的Github倉庫: https://github.com/yuanyan3060/ArknightsGameResource/public/avatar/
        //圖檔名稱剛好是角色id，副檔名是png，例如: 陳的精零頭像是 char_010_chen.png、陳的精二頭像是 char_010_chen_2.png 以此類推
        icon: `${GameConfig.BASE_URL}/avatar/${character.key}.png`,
        //角色排序 
        sortIndex: character.sortIndex, 
        //角色星級
        rarity: Number(character.rarity[character.rarity.length - 1]), //原資料格式類似 "TIER_1"，此處作法為取最後一個字並轉換為number，即可得知角色星級
        //角色職業
        profession: character.profession,
        //角色分支
        subProfessionId: character.subProfessionId,
        //角色最大精英階段
        maxPhase: character.phases.length - 1, //取phases的陣列長度-1，即可得知角色最大精英階段
        //角色各精英階級資訊
        phases: character.phases,
        //角色各技能資訊
        skills: character.skills,
        //角色各天賦資訊
        talents: character.talents,
        //角色潛能資訊
        potentialRanks: character.potentialRanks,
      }
    })
    //排序
    // .sort((a, b) => {
    //   return a.sortIndex - b.sortIndex;
    // });

    characters.value = CharacterGroup;
  }
  catch(error){
    console.error("Failed to fetch character data:", error);
  }
});
</script>

<style lang="scss" scoped>
.character-menu{
  flex: 1;  
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>