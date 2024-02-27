import { cloneDeep } from 'lodash'
export default {
	data() {
		return {
            hasDataCache:false,
        }
	},
    watch:{
    },
	components: {
	},
    created(){
        const rou = this.$store.getters['allstore/menu/curTab']
        console.log(rou,'rou')
        const curData = rou.meta[`__store-${this.$route.path}`]
        console.log(curData,'curData')
        if(curData){
            Object.assign(this.$data,curData); 
            this.hasDataCache = true
        }else{
            this.hasDataCache = false
        }
    },
    beforeRouteUpdate(to,form,next){
        this.setTabMeta(cloneDeep(this.$data))
        next()
    },
    beforeRouteLeave(to,form,next){
        this.setTabMeta(cloneDeep(this.$data))
        next()
    },
	methods: {
		setTabMeta(metaform){
            this.$store.commit('allstore/menu/tabEdit', metaform)
        }
	}
}