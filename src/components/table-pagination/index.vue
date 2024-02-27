<template>
	<el-pagination
		@current-change="handleCurrentChange"
		:current-page="currentPage"
		@size-change="handleCurrentSizeChange"
		:page-size="pageSize"
		:page-sizes="pageSizes"
		:layout="layout"
		:total="total"
		>
	</el-pagination>
</template>
<script>
export default {
	data(){
		return {

		}
	},
	props:{
		layout:{
			type: String,
			default:'total, prev, pager, next, jumper'	
		},
        pageSizes:{
			type:Array,
			default:()=>{
                return [10]
            }
		},
		currentPage:{
			type:Number,
			default:1
		},
		pageSize:{
			type:Number,
			default:10
		},
		total:{
			type:Number,
			default:0
		},
	},
	created() {

	},
  	watch: {

  	},
  	computed: {

  	},
	mounted(){

	},
	methods:{
		handleCurrentSizeChange(val){
			this.$emit('handleSizeChange',val);
		},
		handleCurrentChange(val){
			this.$emit('handleChange',val);
		}
	}
}
</script>