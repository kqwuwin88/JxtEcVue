export default {
	data() {
		return {
			page:1,
			pageSize:10,
			total:0,
		}
	},
	components: {
	},
	methods: {
		handleSizeChange(val){
            this.pageSize = val;
			this.queryList();
		},
		handleCurrentChange(val){
			this.page = val;
			this.queryList();
		},
		queryList(){

		},
	}
}