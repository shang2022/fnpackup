<template>
    <div class="logger-wrap h-100">
        <div class="inner h-100 flex flex-column flex-nowrap">
            <div class="head">
                <el-select v-model="state.page.type" @change="getList" size="small" class="w-10">
                    <el-option v-for="(option,index) in state.types" :key="index" :label="option.label" :value="option.value"></el-option>
                </el-select>
                <el-input v-model="state.page.text" @change="getList" :placeholder="$t('loggerPage.text')" size="small" class="w-10 mgl-1"></el-input>
                <el-button plain type="primary" size="small" :loading="state.loading" @click="getList" class="mgl-1"><el-icon><Refresh></Refresh></el-icon></el-button>
                <el-button plain size="small" @click="handleInfo" class="mgl-1"><el-icon><InfoFilled></InfoFilled></el-icon>{{ $t('loggerPage.info') }}</el-button>
            </div>
            <div class="flex-1 relative">
                <div class="absolute flex flex-column flex-nowrap">
                    <el-table :data="state.page.list" size="small" height="100%" v-loading="state.loading" @row-click="handleRowClick" :row-class-name="tableRowClassName">
                        <el-table-column prop="type" :label="$t('loggerPage.type')" width="80">
                            <template #default="scope">
                                <span>{{state.type2text[scope.row.type]}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="msg" :label="$t('loggerPage.content')"></el-table-column>
                    </el-table>
                    <div class="pages">
                        <div>
                            <el-pagination small background layout="prev, pager, next" 
                            :total="state.page.count"
                            :current-page="state.page.p" 
                            :page-size="state.page.ps" @current-change="handlePageChange"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog class="options-center" title="" destroy-on-close v-model="state.show" top="2vh">
        <div>
            <textarea class="logger-msg">{{ state.msg }}</textarea>
        </div>
    </el-dialog>
    <el-dialog class="options-center" :title="$t('loggerPage.info')" destroy-on-close v-model="state.showInfo" top="2vh" width="560">
        <div>
            <h3>{{ $t('loggerPage.pipe') }}</h3>
            <p>{{ $t('loggerPage.underInstallSpace') }}</p>
            <ul>
                <li>{{ $t('loggerPage.debug') }}: /var/apps/fnpackup/shares/fnpackup-docker/logs/debug.log</li>
                <li>{{ $t('loggerPage.information') }}: /var/apps/fnpackup/shares/fnpackup-docker/logs/info.log</li>
                <li>{{ $t('loggerPage.warning') }}: /var/apps/fnpackup/shares/fnpackup-docker/logs/warning.log</li>
                <li>{{ $t('loggerPage.error') }}: /var/apps/fnpackup/shares/fnpackup-docker/logs/error.log</li>
                <li>{{ $t('loggerPage.fatal') }}: /var/apps/fnpackup/shares/fnpackup-docker/logs/fatal.log</li>
            </ul>
            <h3>{{ $t('loggerPage.writeExample') }}</h3>
            <ul>
                <li>{{ $t('loggerPage.standard') }}: command > /var/apps/fnpackup/shares/fnpackup-docker/logs/debug.log</li>
                <li>{{ $t('loggerPage.standard') }}: command 1> /var/apps/fnpackup/shares/fnpackup-docker/logs/debug.log</li>
                <li>{{ $t('loggerPage.stderr') }}: command 2> /var/apps/fnpackup/shares/fnpackup-docker/logs/error.log</li>
                <li>{{ $t('loggerPage.stdoutStderr') }}: command > /var/apps/fnpackup/shares/fnpackup-docker/logs/error.log 2>&1</li>
            </ul>
        </div>
    </el-dialog>
</template>

<script>
import { fetchLoggerList } from '@/api/api';
import { InfoFilled, Refresh } from '@element-plus/icons-vue';
import { onMounted, reactive} from 'vue';
import { t } from '@/i18n';
export default {
    components:{Refresh,InfoFilled},
    setup () {

        const types = [t('loggerPage.all'),'debug','info','warning','error','fatal'];
        const state = reactive({
            types:types.map((c,index)=> { return {label:c,value:index} } ),
            type2text:types,
            page:{
                type:0,
                text:'',
                p:1,
                ps:20,
                count:0,
                list:[]
            },
           
            loading:false,
            show:false,
            msg:'',
            showInfo:false
        });

        const getList = () => { 
            return new Promise((resolve,reject)=>{ 
                state.loading = true;
                fetchLoggerList(state.page.text,state.page.p,state.page.ps,state.page.type)
                .then(res=>{
                    state.page.count = res.count;
                    state.page.p = res.p;
                    state.page.ps = res.ps;
                    state.page.list = res.list;
                }).finally(()=>{
                    state.loading = false;
                    resolve();
                });
            });
        }
        const handlePageChange = (p)=>{
            state.page.p = p;
            getList();
        }
        const tableRowClassName = ({ row, rowIndex }) => {
            return `type-${row.type}`;
        }
        const handleRowClick = (row, column, event) => {
            state.show = true;
            state.msg = row.msg;
        }

        const handleInfo = ()=>{
            state.showInfo = true;
        }
        
        onMounted(()=>{
            getList();
        });

        return {state,getList,handlePageChange,tableRowClassName,handleRowClick,handleInfo}
    }
}
</script>
<style lang="stylus">
.logger-wrap{
    .type-1 {
        color: blue;
    }

    .type-2 {
        color: #333;
    }

    .type-3 {
        color: #cd9906;
    }

    .type-4 {
        color: red;
    }

    .type-5 {
        color: red;
        font-weight: bold;
    }
}
</style>
<style lang="stylus" scoped>
html.dark .logger-wrap{
    .inner{
        border-color:var(--main-border-color);
        .head{
            border-color:var(--main-border-color);
        }
    }
}

.logger-msg {
    width: 100%;
    height: 40rem;
    box-sizing: border-box;
    padding: 1rem;
    margin-top:1rem;
    background: #f5f5f5;
    border:1px solid #eee;
    border-radius: 4px;
    font-size: 1.2rem;
    resize: none;
    outline: none;
    overflow: auto;
    white-space:nowrap;
}

.logger-wrap{
    
    overflow hidden;
    padding:2rem;
    box-sizing: border-box;
    
    .inner{
        border:1px solid #e2e8f0e6;
        border-radius:5px;
        box-sizing: border-box;
        
        .w-10{width:10rem;}

        .pages{
            text-align: center;
            padding:1rem 0;
            &>div{
                display: inline-block;
            }
        }

        .tips{
            font-size:1.2rem;
            margin-left:1rem;
        }
        .head{
            border-bottom:1px solid #e2e8f0e6;
            padding:.6rem 1rem;
        }
    }
}
</style>
