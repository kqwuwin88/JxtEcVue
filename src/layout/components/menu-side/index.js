import { mapGetters } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'
// import BScroll from 'better-scroll'

export default {
  name: 'menu-side',
  mixins: [
    menuMixin
  ],
  render (h) {
    return <div class="menu-side">
        <div class="menu-pad">
      <el-menu
        uniqueOpened={ true }
        defaultActive={ this.$route.fullPath }
        ref="menu"
        onSelect={ this.handleMenuSelect }>
        { this.aside.map(menu => createMenu.call(this, h, menu)) }
      </el-menu>
      </div>
    </div>
  },
  data () {
    return {
      BS: null
    }
  },
  computed: {
    ...mapGetters('allstore/menu', [
        'aside'
    ])
  },
  watch: {
  },
  mounted () {
    //this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      /* this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      }) */
    },
    scrollDestroy () {
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
