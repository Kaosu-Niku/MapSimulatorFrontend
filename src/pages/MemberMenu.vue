<template>
  <div>

    <el-button 
      type="info" 
      @click="memberMenuShow = true"
      class="member-fixed-icon" 
    >
      <el-icon >
        <View />
      </el-icon>
    </el-button>

    <transition> 

    <div
      class="member-menu"
      v-show="memberMenuShow"
    >
      <div class="icons">
        <el-button type="info" @click="memberMenuShow = false">
          <el-icon >
            <Hide />
          </el-icon>
        </el-button>       
      </div>  
      
      <MemberSelect />
    </div>

    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MemberSelect from "./MemberSelect.vue"

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

const memberMenuShow = ref(true);
</script>

<style scoped lang="scss">
.member-menu{
  overflow: hidden;
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

.member-fixed-icon{
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
