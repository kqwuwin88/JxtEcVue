<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "app",
    watch: {
    },
    created() {
       
    },
    beforeDestroy(){
        
    },
    methods: {},
};
</script>
<style lang="scss">
   

    ::-webkit-scrollbar {
    width:12px;
    height: 12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    border-radius:12px;
    background:rgba(145, 161, 187, 0.3);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius:12px;
    background:rgba(145, 161, 187, 0.3);
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(145, 161, 187, 0.5);
}
</style>
