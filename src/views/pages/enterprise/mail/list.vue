<template>
	<div class="init-content-lay cols-wrap" flex>
			<div class="left-tree" flex-box="0">
				<!-- <div class="left-tree-top" flex="cross:center">
					<el-button type="text" icon="el-icon-plus" flex-box="0" @click="appendTreeHandle()">新建</el-button>
				</div> -->
				<el-scrollbar class="scrollbar-wrap">
					<div class="el-tree-lay">
						<el-tree :data="treeData" ref="tree" :props="defaultProps" node-key="id" :indent="30" icon-class="el-icon-plus cus_col_ico" highlight-current
							:current-node-key="currentNnode" @node-expand="expandTreeKey"
							@node-collapse="collapseTreeKey" @current-change="handleNodeClick"
							:expand-on-click-node="false" :default-expanded-keys="expandedKeys">
							<span class="custom-tree-node" :class="`line${node.level}`" slot-scope="{ node, data }">
								<span style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;" :title="node.label">
									<img src="@/assets/imgs/mail_04.png" v-if="node.level === 1" class="tree-img">
									<img src="@/assets/imgs/mail_05.png" v-else-if="node.isLeaf" class="tree-img">
									<img src="@/assets/imgs/mail_06.png" v-else class="tree-img">
									{{ node.label }}
								</span>
								<span class="node-btn" @click.stop>
									<img src="@/assets/imgs/mail_01.png" @click="appendTreeHandle(data)" title="添加" />
									<img src="@/assets/imgs/mail_02.png" v-if="node.level !== 1" @click="editTreeHandle(data)" title="修改" />
									<img src="@/assets/imgs/mail_03.png" v-if="node.level !== 1" @click="removeTreeHandle(node,data)" title="删除" />
								</span>
							</span>
						</el-tree>
					</div>
				</el-scrollbar>
			</div>
			<div flex-box="1" flex="dir:top" class="cols-rt-lay">
				<div class="toolbar-lay vsd-mb-10" flex-box="0">
					<div flex="main:justify cross:center" class="vsd-mb-20">
						<!-- <div>
                            <b class="vsd-mr-10">{{currentLabel}}</b>
                        </div> -->
						<el-form inline :model="formInline">
							<el-form-item label="">
								<el-input placeholder="请输入手机号码" v-model.trim="formInline.msisdn" style="width:140px;"
								@keyup.enter.native="searchList" maxlength="11"	clearable>
								</el-input>
							</el-form-item>
							<el-form-item label="">
								<el-input placeholder="请输入姓名" v-model.trim="formInline.name" style="width:140px;"
								@keyup.enter.native="searchList"	clearable>
								</el-input>
							</el-form-item>
							<el-form-item label="">
								<el-button type="primary" @click="searchList">搜索</el-button>
							</el-form-item>
						</el-form>
						
					</div>

				</div>
				<div flex-box="1" class="content-list-wrap" flex="dir:top">
					<div flex-box="0" class="vsd-mb-10">
						<el-button type="primary" icon="el-icon-plus" @click="rowChildEdit()" v-show="currentNnode !== '0'">新建</el-button>
						<el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length===0" @click="delAll()">删除</el-button>
						<el-button type="warning" icon="el-icon-upload2" @click="importHandle" v-show="currentNnode !== '0'">导入</el-button>
						<el-button type="success" icon="el-icon-download" @click="exportHandle" v-show="currentNnode !== '0'">导出</el-button>
					</div>
					<div class="table-wrap" flex-box="1" v-loading="loading" element-loading-text="加载中"
						element-loading-spinner="el-icon-loading">
						<el-table :data="tableData" @selection-change="handleSelectionChange" class="table-border"
							ref="multipleTable" height="100%">
							<el-table-column type="selection" width="40px" show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="姓名" width="" prop="c_name" show-overflow-tooltip></el-table-column>
							<el-table-column label="手机号码" width="" prop="msisdn" show-overflow-tooltip>
								<!--<template slot-scope="scope">{{scope.row.msisdn? scope.row.msisdn.replace(/(\d{3})\d*(\d{4})/ , '$1****$2'):""}}</template>-->
							</el-table-column>
							<el-table-column label="出生日期" width="" prop="bothDate" show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="生日提醒" width="" prop="status" show-overflow-tooltip>
								<template slot-scope="scope">
									{{ scope.row.status === 0 ? '是' : '否' }}
								</template>
							</el-table-column>
							<!--<el-table-column label="性别" width="" prop="sex" show-overflow-tooltip>
								<template slot-scope="scope">
									{{ scope.row.sex === 0 ? '男' : '女' }}
								</template>
							</el-table-column>-->
							<el-table-column label="职位" width="160" prop="job" show-overflow-tooltip></el-table-column>
							<!--<el-table-column label="所属组" width="" prop="groupName" show-overflow-tooltip>
							</el-table-column>-->
							<el-table-column label="操作" width="80" align="left">
								<template slot-scope="scope">
									<i class="el-icon-edit-outline row_icon_link" @click="rowChildEdit(scope.row)" v-if="currentNnode !== '0'" title="修改"></i>
                            		<i class="el-icon-delete row_icon_link" @click="delRow(scope.row)" title="删除"></i>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="pagination-wrap" flex="main:right" flex-box="0">
						<vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
					</div>
				</div>
			</div>

		<vsd-ico-dialog title="导入" icon="09" :visible.sync="dialogFormImport" width="440px">
			<el-form label-position="top">
				<el-form-item label="">
					<el-upload class="pic-uploader" action="" :show-file-list="false"
						:before-upload="beforeAvatarUpload">
						<a href="javascript:;" class="pic-uploader-icon vsd-mr-5"><i class="el-icon-upload2"></i>上传文件</a>
					</el-upload>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="text" @click="dwLink">通讯录模板下载</el-button>
			</div>
		</vsd-ico-dialog>
		<vsd-ico-dialog :title="dialogForm.id ? '修改联系人' : '新增联系人'" :icon="dialogForm.id?'08':'07'" :visible.sync="dialogFormVisible" width="640px">
			<el-form :model="dialogForm" label-position="top" ref="dialogForm" :rules="rules">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="姓名" prop="c_name">
							<el-input v-model.trim="dialogForm.c_name" autocomplete="off" maxlength="20" placeholder="请输入姓名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号码" prop="msisdn">
							<el-input v-model.trim="dialogForm.msisdn" autocomplete="off" @input="handleInput" maxlength="11" placeholder="请输入手机号码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位">
							<el-input v-model.trim="dialogForm.job" autocomplete="off" maxlength="30" placeholder="请输入职位" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出生日期">
							<el-date-picker v-model="dialogForm.bothDate" type="date" style="width:100%;" placeholder="请选择"
								value-format="yyyy-MM-dd" clearable></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否需要生日提醒">
							<el-radio-group v-model="dialogForm.status">
								<el-radio :label="0">需要</el-radio>
								<el-radio :label="1">不需要</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱">
							<el-input v-model.trim="dialogForm.email" autocomplete="off" maxlength="30" placeholder="请输入邮箱" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别">
							<el-radio-group v-model="dialogForm.sex">
								<el-radio-button :label="0">男</el-radio-button>
								<el-radio-button :label="1">女</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitDialog" size="small">确 定</el-button>
				<el-button @click="dialogFormVisible = false" type="primary" plain size="small">取 消</el-button>
			</div>
		</vsd-ico-dialog>

		<vsd-ico-dialog :title="dialogGroupForm.id ? '修改' : '新增'" :icon="dialogForm.id?'05':'06'" :visible.sync="dialogGroupFormVisible" width="640px">
			<el-form :model="dialogGroupForm" label-position="top" ref="dialogGroupForm" :rules="rulesGroup">
				<el-form-item label="下方文本框中输入通讯录组名称" prop="group_name">
					<el-input v-model.trim="dialogGroupForm.group_name" autocomplete="off" maxlength="15"
						show-word-limit resize="none" placeholder=""></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitGroupDialog" size="small">确 定</el-button>
				<el-button @click="dialogGroupFormVisible = false" type="primary" plain size="small">取 消</el-button>
			</div>
		</vsd-ico-dialog>

	</div>

</template>

<script>
import pagination from '@/mixins/pagination'
let id = 1000;
export default {
	data() {
		return {
			loading: false, //初始化加载log
			pageSize: 10, //实例化条数
			pageSizes: [10, 20, 30, 50, 100], //实例化分页条数
			rules: {
				c_name: [{
					required: true,
					message: '请输入姓名！',
					trigger: 'blur'
				},],
				msisdn: [{
					required: true,
					message: '请输入手机号码！',
					trigger: 'blur'
				}, {
					min: 11,
					max: 11,
					message: '请输入11位手机号码！',
					trigger: 'blur'
				},],
			},
			dialogGroupFormVisible: false,
			rulesGroup: {
				group_name: [{
					required: true,
					message: '通讯录组名称不能为空！',
					trigger: 'blur'
				}, {
					message: '通讯录组名称长度不能超过15',
					maxlength: 15,
					trigger: 'blur'
				},],
			},
			checked: false, //复选框是否选中，默认未选中
			activeName: '0',
			formInline: {
				msisdn: '',
				name: '',
				groupNameAll: '0', //所有组复选框传值
			},
			dialogFormImport: false,
			dialogFormVisible: false,
			dialogForm: {
				id: '',
				c_name: '',
				msisdn: '',
				sex: 0,
				bothDate: '',
				groupName: '', //显示联系人对应组
				job: '',
				status:1,
			},
			dialogGroupForm: {
				id: '',
				group_name: '',
				parentId: '',
			},
			currentLabel: '--',
			tableData: [],
			multipleSelection: [],
			currentNnode: '',
			isGroup:true,
			expandedKeys: ['0'],
			treeData: [],
			defaultProps: {
				children: 'children',
				label: 'group_name'
			}
		}
	},
	mixins: [pagination],
	components: {},
	created() {
		this.queryListTree().then(res => {
			this.currentNnode = this.treeData.length ? this.treeData[0].id : ''
			this.currentLabel = this.treeData.length ? this.treeData[0].group_name : ''
			this.$refs.tree.setCurrentKey(this.currentNnode)
		});
		console.log(this.$route.matched)
	},
	watch: {
		currentNnode(val) {
			this.$refs.tree.setCurrentKey(this.currentNnode)
			this.page = 1
			this.queryList(val)
		},
		inputVal: {
			handler(val) {
				this.$nextTick(() => {

					console.log(11)
				})
			},
			deep: true,
			immediate: true
		},
	},
	computed: {},
	mounted() { },
	methods: {
		handleInput(value) {
			const reg = /^[\d\.]+$/;
			if (value && !reg.test(value)) {
				this.dialogForm.msisdn = value.replace(/[^\d\.]/g, '');
			}
		},
		expandTreeKey(data, node, cur) {
			this.expandedKeys.push(data.id)
		},
		collapseTreeKey(data, node, cur) {
			const index = this.expandedKeys.findIndex(item => item === data.id)
			if (index > -1) {
				this.expandedKeys.splice(index, 1)
			}
		},
		exportHandle() {
			//window.location.href = process.env.VUE_APP_APR+'/exportCustomer?groupId=1' + this.currentNnode;
			window.location.href =
				`${process.env.VUE_APP_APR}/exportTxl?groupId=${this.currentNnode}&msisdn=${this.formInline.msisdn}&name=${this.formInline.name}&groupNameAll=${this.formInline.groupNameAll}`
		},
		importHandle() {
			if(this.isGroup) return this.$message.warning('群组不能添加联系人')
			this.dialogFormImport = true;
		},
		dwLink() {
			window.location.href = process.env.VUE_APP_APR + '/downloadFile?fileType=1';
		},
		beforeAvatarUpload(file) {
			console.log(file)
			const excelTypes = ['xls','xlsx']
            var index= file.name.lastIndexOf(".");
            var ext = file.name.substr(index+1);
            const isExcel = excelTypes.indexOf(ext) > -1
			const isLt2M = file.size / 1024 / 1024 < 20;
			if (!isExcel) {
				this.$message.error('只能是excel格式!');
				return false
			}
			var formData = new FormData() // 声明一个FormData对象
			formData.append('file', file);
			formData.append('groupId', this.currentNnode);
			this.$api.importTxl(formData).then(res => {
				this.queryList(this.currentNnode)
				this.$message({
					message:res.msg + res.wrongMsg,
					type:'success',
					customClass:'cus_message',
					showClose:true
				})
				this.dialogFormImport = false
			}).catch(error => { })
			return false;
		},

		handleNodeClick(data) {
			this.currentNnode = data.id
			this.currentLabel = data.group_name
			this.isGroup = data.children && data.children.length > 0

		},
		searchList() {
			this.page = 1
			this.queryList()
		},
		queryList() {
			this.tableData = []
			this.loading = true
			this.$api.getTxlList({
				...this.formInline,
				groupId: this.currentNnode,
				page: this.page,
				pageSize: this.pageSize
			}).then(res => {
				this.tableData = res.info
				this.total = res.total
				this.loading = false
			}).catch(error => {
				this.loading = false
				console.log(error)
			})
		},
		//添加一级通讯录组
		submitGroupDialog() {
			this.$refs.dialogGroupForm.validate((valid) => {
				if (valid) {
					if (this.dialogGroupForm.id === '') {
						this.$api.addGroup({
							parentId: this.dialogGroupForm.parentId,
							group_name: this.dialogGroupForm.group_name
						}).then(res => {
							this.$message.success('操作成功')
							this.queryListTree().then(res => {
								this.$refs.tree.setCurrentKey(this.currentNnode)
							});

							this.dialogGroupFormVisible = false
						}).catch(error => {
							console.log(error)
						})
					} else {
						this.$api.modifyGroup({
							id: this.dialogGroupForm.id,
							group_name: this.dialogGroupForm.group_name
						}).then(res => {
							this.$message.success('操作成功')
							this.queryListTree().then(res => {
								this.$refs.tree.setCurrentKey(this.currentNnode)
							});
							this.dialogGroupFormVisible = false
						}).catch(error => {
							console.log(error)
						})
					}
				} else {
					// this.$message.error("表单校验失败，请检查");
					return false
				}
			})
		},
		appendTreeHandle(data) {
			if(data.id === '0'){
				this.setAppendData(data)
			}else{
				this.$api.getTxlList({
					...this.formInline,
					groupId: data.id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					if(res.info.length === 0){
						this.setAppendData(data)
					}else{
						this.$message.warning('该通讯录群组有联系人')
					}
				}).catch(error => {})
			}
		},
		setAppendData(data){
			this.dialogGroupForm.group_name = ''
			this.dialogGroupForm.id = ''
			this.dialogGroupForm.parentId = data.id!=='0' ? data.id : '0'
			this.dialogGroupFormVisible = true
		},
		editTreeHandle(data) {
			this.dialogGroupForm.group_name = data.group_name
			this.dialogGroupForm.id = data.id
			this.dialogGroupForm.parentId = ''
			this.dialogGroupFormVisible = true
		},
		removeTreeHandle(node, data) {
			console.log(node, 'node')
			this.$confirm('删除后数据将不可恢复，确认删除？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				iconClass: 'el-icon-warning-outline',
				customClass: 'custom-message-confirm',
				center: 'true'
			}).then(() => {
				console.log(data,'this.$api.delGroup')
				this.$api.delGroup({
					id: data.id
				}).then(res => {
					this.queryListTree().then(resChild => {
                       console.log(resChild,'removeTreeHandle');
						if (data.id === this.currentNnode) {
							if (this.treeData.length > 0) {
								this.currentNnode = node.parent.key || this.treeData[0].id
								this.currentLabel = node.parent.label || this.treeData[0]
									.group_name
							} else {
								this.currentNnode = ''
								this.currentLabel = '--'
							}
						}
						this.$refs.tree.setCurrentKey(this.currentNnode)
					})
				})
			}).catch(() => { });
		},
		rowChildEdit(row) {
			if(this.isGroup) return this.$message.warning('群组不能导入联系人')
			this.dialogForm.id = row ? row.id : '';
			this.dialogFormVisible = true;
			if (this.dialogForm.id != '') {
				this.$api.getTxl({id:this.dialogForm.id}).then(res => {
					for (let key in this.dialogForm) {
						this.dialogForm[key] = res.info[key]
					}
					console.log(this.dialogForm, 231, res.info)
				}).catch(error => { })
			} else {
				for (let key in this.dialogForm) {
					this.dialogForm[key] = '';
				}
				this.dialogForm.sex = 0
				this.dialogForm.status = 0
			}
		},
		getTrees(list, parentId) {
			let parentObj = {};
			list.forEach(o => {
				parentObj[o.id] = o;
			})
			if (!parentId) {
				return list.filter(o => !parentObj[o.parentId]).map(o => (o.children = this.getTrees(list, o.id), o));
			} else {
				return list.filter(o => o.parentId == parentId).map(o => (o.children = this.getTrees(list, o.id), o));
			}
		},
		queryListTree() {
			return this.$api.getGroupList().then(res => {
				var xss = [
					{
						id:'0',
						group_name:'通讯录',
						children:this.getTrees(res.info)
					}
				]
				this.treeData = xss

			})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		delAll() {
			this.$confirm('删除后数据将不可恢复，确认删除？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showClose: false,
				iconClass: 'el-icon-warning-outline',
				customClass: 'custom-message-confirm',
				center: 'true'
			}).then(() => {
				console.log(this.multipleSelection)
				var ids = this.multipleSelection.map(item => item.id).join(',')
				this.page = 1
				this.$api.delTxl({id:ids}).then(res => {
					this.$message({
						message: '操作成功',
						type: 'success'
					});
					this.queryList(this.currentNnode);
				}).catch(error => { })
			}).catch(() => { })
		},
		delRow(row) {
			this.$confirm('删除后数据将不可恢复，确认删除？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showClose: false,
				iconClass: 'el-icon-warning-outline',
				customClass: 'custom-message-confirm',
				center: 'true'
			}).then(() => {
				this.$api.delTxl({id:row.id}).then(res => {
					this.$message({
						message: '操作成功',
						type: 'success'
					});
					this.page = 1
					this.queryList(this.currentNnode);
				}).catch(error => { })
			}).catch(() => { });
		},
		//添加联系人
		submitDialog() {
			this.$refs.dialogForm.validate((valid) => {
				if (valid) {
					let mhs = this.dialogForm.id ? 'modifyTxl' : 'addTxl'
					if (this.dialogForm.c_name == '') return this.$message.warning('请输入姓名!');
					this.$api[mhs]({
						...{
							groupId: this.currentNnode
						},
						...this.dialogForm
					}).then(res => {
						
						this.dialogFormVisible = false;
						this.queryList(this.currentNnode);
					}).catch(error => { })
				} else {
					// this.$message.error("表单校验失败，请检查");
					return false
				}
			})

		},
	}
}
</script>
<style scoped lang="scss">
.toolbar-lay {
	/deep/.el-form-item {
		margin-bottom: 0 !important;
	}
}

/deep/.el-dialog__body {
	.el-form-item__label {
		padding-bottom: 0;
	}
}
</style>
