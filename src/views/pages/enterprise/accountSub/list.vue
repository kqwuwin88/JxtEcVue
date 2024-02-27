<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="企业名称" v-model="formInline.corpName" />
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%" style="width:100%">
                    <el-table-column prop="id" label="集团编号" width=""></el-table-column>
                    <el-table-column prop="corpName" label="企业名称" width=""></el-table-column>
                    <el-table-column prop="signatureName" label="签名" width=""></el-table-column>
                    <el-table-column prop="serviceCode" label="接入号" width=""></el-table-column>
                    <el-table-column prop="daySmsNum" label="日短信流量" width=""></el-table-column>
                    <el-table-column prop="monthSmsNum" label="月短信流量" width=""></el-table-column>
                    <el-table-column prop="status" label="状态" width="">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
export default {
	data(){
		return {
			formInline:{
                corpName:'',
			},
			tableData:[],
		}
	},
    filters:{
        filterStatus(val){
            const obj = {0:'正常', 1:'暂停'}
			return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.queryList()
	},
  	watch: {
    },
  	computed: {},
	mounted(){},
	methods:{
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.childCorpList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>