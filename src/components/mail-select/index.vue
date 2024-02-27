<template>
    <vsd-ico-dialog title="通讯录选择" icon="12" :visible.sync="pageVisible" width="960px">
        <el-tabs v-model="activeName">
            <el-tab-pane label="按联系人选择" name="first">
                <div flex class="mail-dia-wrap">
                    <div class="left" flex-box="0" flex="dir:top">
                        <div class="top" flex-box="0">
                            <div class="title">通讯录</div>
                            <div class="content">
                                <el-tree :data="treeData" :expand-on-click-node="false" :props="defaultProps" ref="tree" :current-node-key="currentNnode" @node-click="handleNodeClick"></el-tree>
                            </div>
                        </div>
                        <div class="bottom" flex-box="0">
                            <div class="title">联系人共：{{customData.length}}</div>
                            <div class="content">
                                <el-table :data="customData" @selection-change="val=>handleSelectionChange(val,'multipleSelectionList')" class="table-border" ref="multipleTableList" height="100%" @cell-click="row=>handleCksChange(row,'multipleTableList')">
                                    <el-table-column type="selection" width="50" align="center" show-overflow-tooltip></el-table-column>
                                    <el-table-column  label="姓名" width="" prop="c_name" show-overflow-tooltip></el-table-column>
                                    <el-table-column  label="手机号码" width="" prop="msisdn" show-overflow-tooltip>
                                        <template slot-scope="scope">{{scope.row.msisdn? scope.row.msisdn.replace(/(\d{3})\d*(\d{4})/ , '$1****$2'):""}}</template>
                                    </el-table-column>
                                    <el-table-column  label="职位" width="" prop="job" show-overflow-tooltip></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    <div class="center" flex-box="0">
                        <a href="javascript:;" @click="toRightList" class="el-icon-arrow-right arrow_r"></a>
                        <a href="javascript:;" @click="detRightList" class="el-icon-arrow-left arrow_l"></a>
                    </div>
                    <div class="right" flex-box="1">
                        <div class="title">已选联系人：{{resCustomData.length}}</div>
                        <div class="content">
                            <el-table :data="resCustomData" @selection-change="val=>handleSelectionChange(val,'multipleSelectionRes')" class="table-border" ref="multipleTableRes" height="100%" @cell-click="row=>handleCksChange(row,'multipleTableRes')">
                                <el-table-column type="selection" width="50" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column  label="姓名" width="" prop="c_name" show-overflow-tooltip></el-table-column>
                                <el-table-column  label="手机号码" width="" prop="msisdn" show-overflow-tooltip>
                                    <template slot-scope="scope">{{scope.row.msisdn? scope.row.msisdn.replace(/(\d{3})\d*(\d{4})/ , '$1****$2'):""}}</template>
                                </el-table-column>
                                <el-table-column  label="职位" width="" prop="job" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="按通讯录组选择" name="second">
                <div style="height:400px;overflow:auto;">
                    <el-tree :data="treeData" :props="defaultProps" :default-checked-keys="defaultCheckedKeys" show-checkbox ref="treeCksBox" nodeKey="id"></el-tree>
                </div>
            </el-tab-pane>
        </el-tabs>
        
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogSubmit" size="small">确 定</el-button>
            <el-button @click="pageVisible = false" type="primary" plain size="small">取 消</el-button>
        </div>
    </vsd-ico-dialog>
</template>

<script>
export default {
	data(){
		return {
            activeName:'first',
            pageVisible:false,
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'group_name'
            },
            currentNnode:'',
            tableData:[],
            customData:[],
            resCustomData:[],
            multipleSelectionList:[],
            multipleSelectionRes:[],
            defaultCheckedKeys:[]
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
        detRightList(){
            this.multipleSelectionRes.forEach(row=>{
                this.resCustomData.forEach((item,index)=>{
                    if(item.id === row.id){
                        this.resCustomData.splice(index,1)
                    }
                })
            })
        },
        handleSelectionChange(val,multipleSelection) {
        	this[multipleSelection] = val;
      	},
        getGroupList(){
            this.$api.getGroupList().then(res=>{
                this.tableData = res.info
            })
		},
        handleCksChange(row,multipleTable){
            this.$refs[multipleTable].toggleRowSelection(row)
        },
        dialogSubmit(){
            const res = this.$refs.treeCksBox.getCheckedNodes(true)
            const cksCustom = JSON.parse(JSON.stringify(this.resCustomData))
            this.$emit('mailChange',{cksRows:res,cksCustom:cksCustom})
            this.pageVisible = false
        },
        toRightList(){
            this.multipleSelectionList.forEach(row=>{
                let arr = this.resCustomData.filter(item=>item.id === row.id)
                if(arr.length===0){
                    this.resCustomData.push(row)
                }
            })
        },
        handleNodeClick(data){
            this.currentNnode = data.id
            this.queryCustomerList(data.id)
        },
        getTrees(list, parentId) {
            let parentObj = {};
            list.forEach(o => {
                parentObj[o.id] = o;
            })
            if(!parentId){
                return list.filter(o => !parentObj[o.parentId]).map(o => (o.children = this.getTrees(list, o.id), o));
            }else{
                return list.filter(o => o.parentId == parentId).map(o => (o.children = this.getTrees(list, o.id), o));
            }
        },
		queryTreeData(){
            return this.$api.getGroupList().then(res=>{
                var xss = this.getTrees(res.info)
                this.treeData = xss
            })
		},
        //获取联系人信息列表
        queryCustomerList(id){
            this.$api.queryTxl({groupId:id}).then( res => { 
                this.customData = res.info
                this.$nextTick(()=>{
                    this.resCustomData.forEach(row=>{
                        this.customData.forEach(item=>{
                            if(item.id === row.id){
                                this.$refs.multipleTableList.toggleRowSelection(item,true)
                            }
                        })
                    })
                })
                
                this.total = res.total
            }).catch(error=>{
                console.log(error)
            })
        },
        open(res){
            this.pageVisible = true
            this.resCustomData = res.cksCustom
            this.defaultCheckedKeys = res.cksRows.map(item => item.id)
            this.getGroupList()
            this.queryTreeData()
        },
        
        closeDialog(e) {
            this.pageVisible = false
        },
       
	}
}
</script>
<style scoped lang="scss">
    .mms_view_title{
        border: 1px solid #d4d5db;
        border-radius: 3px;
        display: flex;
        span{
            padding: 10px;
            flex: 0 0 auto;
            border-right: 1px solid #d4d5db;
        }
        p{
            padding: 10px;
            white-space: nowrap;
            flex: 1 1 auto;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .mms_view_zm{
        border: 1px solid #d4d5db;
        margin-top: 10px;
        padding: 6px 30px;
        .pre_mms_content{
            height: 100%;
            overflow: auto;
            .text{
                font-size: 14px;
                color: #3d3b3d;
            }
        }
    }
    
</style>