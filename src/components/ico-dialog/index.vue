<template>
    <el-dialog :visible.sync="pageVisible" append-to-body :width="width" class="custom-dialog" :class="customClass" :close-on-click-modal="false" :close-on-press-escape="onEscape" :show-close="showClose">
        <div slot="title" flex="cross:center">
            <img class="vsd-mr-10" v-if="icon" :src="require('@/assets/imgs/modal/'+icon + '.png')" />
            <span>{{title}}</span>
        </div>
        <slot></slot>
        <slot name="footer" slot="footer"></slot>
    </el-dialog>
</template>

<script>
export default {
	data(){
		return {
		}
    },
    props:{
        title:String,
        onEscape:{
            type:Boolean,
            default:true,
        },
        showClose:{
            type:Boolean,
            default:true,
        },
        visible:{
            type:Boolean,
            default:false,
        },
        icon: {
            type: String,
            default: ''
        },
        width:String,
        customClass: {
            type: String,
            default: ''
        },
    },
    computed: {
        pageVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
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
	}
}
</script>