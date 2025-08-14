<template>
  <div class="character-menu">
    <CharacterCard 
      v-for="(character) in characters"
      :character=character
    />
  </div>
  
</template>

<script lang="ts" setup>
import request from "../api/request"
import { ref, watch, onMounted } from "vue";
import CharacterCard from "./CharacterCard.vue"

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

    const CharacterGroup = characterDatas.map((character) => {
      return {
        //id
        key: character.key,
        //名稱
        name: character.name, 
        //角色頭像
        icon: "https://media.prts.wiki/9/94/%E5%A4%B4%E5%83%8F_%E5%AE%89%E8%B5%9B%E5%B0%94.png",
        //角色排序 
        sortIndex: character.sortIndex, 
        //角色星級
        rarity: Number(character.rarity[character.rarity.length - 1]), //原資料格式類似 "TIER_1"，此處作法為取最後一個字並轉換為number，即可得知角色星級
        //角色職業
        profession: character.profession,
        //角色分支
        subProfessionId: character.subProfessionId,
        //角色最大精英階段
        maxPhase: character.phases.length, //取phases的陣列長度，即可得知角色最大精英階段
        //角色各精英階級資訊
        phases: character.phases,
        //角色各技能資訊
        skills: character.skills,
        //角色各天賦資訊
        talents: character.talents,
        //角色潛能資訊
        potentialRanks: character.potentialRanks,

        skillData: { //技能相關資訊
          icon: [
            "https://media.prts.wiki/thumb/6/60/%E6%8A%80%E8%83%BD_%E6%B2%BB%E7%96%97%E8%8C%83%E5%9B%B4%E5%BC%BA%E5%8C%96.png/50px-%E6%8A%80%E8%83%BD_%E6%B2%BB%E7%96%97%E8%8C%83%E5%9B%B4%E5%BC%BA%E5%8C%96.png"
          ],
        }, 
      }
    });

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
}
</style>