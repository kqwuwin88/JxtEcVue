<template>
    <router-view />
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    name: "layout-header-inside",
    components: {
    },
    computed: {
        ...mapGetters('allstore/menu', [
            'tabs',
        ]),
        tabNames(){
            return this.tabs.map(item=>item.name)
        }
    },
}
</script>