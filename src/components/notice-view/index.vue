<template>
    <el-dialog :visible.sync="pageVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
        <div slot="title"> <vsd-icon name="volume-up" class="vsd-mr-5 m-color"/>{{viewData.subject}} </div>
        <div v-html="viewData.content" class="mms-content-mode"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="pageVisible = false" type="primary" plain size="small">关 闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
	data(){
		return {
            viewData:{
                content:'',
                subject:'',
            },
            pageVisible:false,
		}
    },
    props:{
        
    },
    computed: {
        
    },
    components:{
    },
    filters:{
    },
  	watch: {
        
    },
    created(){
    },
	mounted(){},
	methods:{
        queryView(id){
			this.$api.getAnnouncement({id}).then( res => { 
                this.pageVisible = true
                this.viewData.content = res.info.content
                this.viewData.subject = res.info.subject
			}).catch(error=>{})
        },
	}
}
</script>