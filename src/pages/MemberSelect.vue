<template>
  <div class="member-menu">
    <MemberCard 
      v-for="(member) in members"
      :member=member
    />
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import MemberCard from "./MemberCard.vue"

//一個標準的幹員資料Object
let exampleMember = { 
  name: "安賽爾", //名稱
  icon: "https://media.prts.wiki/9/94/%E5%A4%B4%E5%83%8F_%E5%AE%89%E8%B5%9B%E5%B0%94.png",
  profession: "醫療", //職業
  rarity: 3, //星級
  maxPhase: 1, //最大精英階段 0 = 精0、 1 = 精1、 2 = 精2    
  skillData: { //技能相關資訊
    icon: [
      "https://media.prts.wiki/thumb/6/60/%E6%8A%80%E8%83%BD_%E6%B2%BB%E7%96%97%E8%8C%83%E5%9B%B4%E5%BC%BA%E5%8C%96.png/50px-%E6%8A%80%E8%83%BD_%E6%B2%BB%E7%96%97%E8%8C%83%E5%9B%B4%E5%BC%BA%E5%8C%96.png"
    ],
  }, 
}
let exampleMember1 = { 
  name: "水月", //名稱
  icon: "https://media.prts.wiki/0/05/%E5%A4%B4%E5%83%8F_%E6%B0%B4%E6%9C%88.png",
  profession: "特種", //職業
  rarity: 6, //星級
  maxPhase: 2, //最大精英階段 0 = 精0、 1 = 精1、 2 = 精2    
  skillData: { //技能相關資訊
    icon: [
      "https://media.prts.wiki/thumb/2/24/%E6%8A%80%E8%83%BD_%E5%94%A4%E9%86%92.png/50px-%E6%8A%80%E8%83%BD_%E5%94%A4%E9%86%92.png",
      "https://media.prts.wiki/thumb/3/3d/%E6%8A%80%E8%83%BD_%E5%9B%9A%E5%BE%92%E5%9B%B0%E5%A2%83.png/50px-%E6%8A%80%E8%83%BD_%E5%9B%9A%E5%BE%92%E5%9B%B0%E5%A2%83.png",
      "https://media.prts.wiki/thumb/4/4b/%E6%8A%80%E8%83%BD_%E9%95%9C%E8%8A%B1%E6%B0%B4%E6%9C%88.png/50px-%E6%8A%80%E8%83%BD_%E9%95%9C%E8%8A%B1%E6%B0%B4%E6%9C%88.png",
    ],
  }, 
}
const members = ref([exampleMember, exampleMember1, exampleMember1]);

</script>

<style lang="scss" scoped>
.member-menu{
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>