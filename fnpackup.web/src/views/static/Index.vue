<template>
    <div class="table-wrap h-100">
        <div class="inner h-100 flex flex-column flex-nowrap">
            <div class="head">
                <el-button plain type="primary" size="small" :loading="state.loading" @click="handleSearch"><el-icon><Refresh></Refresh></el-icon>{{ $t('static.reloadAndRefresh') }}</el-button>
                <span class="tips">{{ $t('static.reloadTip') }}</span>
            </div>
            <div class="flex-1 relative">
                <div class="absolute">
                    <el-table :data="state.list" size="small" height="98%" v-loading="state.loading">
                        <el-table-column prop="name" :label="$t('static.name')">
                            <template #default="scope">
                                <div class="flex">
                                    <span>{{scope.row.name}}</span>
                                    <router-link :to="{name:'StaticView',query:{name:scope.row.name}}" class="mgl-2 a-line">{{ $t('static.openEmbedded') }}</router-link>
                                    <a :href="`${state.baseUrl}/${scope.row.name}/?t=${Date.now()}`" target="_blank" class="mgl-1 a-line">{{ $t('static.openNewWindow') }}</a>
                                </div>
                                
                            </template>
                        </el-table-column>
                        <el-table-column prop="root" :label="$t('static.root')"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {fetchStaticList, fetchStaticSearch } from '@/api/api';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, reactive} from 'vue';
import { t } from '@/i18n';
export default {
    components:{Refresh},
    setup () {

        const baseUrl = process.env.NODE_ENV === 'development' ? `http://localhost:1069` : `${window.location.origin}/${window.location.pathname}`
        const state = reactive({
            list:[],
            loading:false,
            baseUrl: baseUrl.replace(/\/$/,'')
        });

        const getList = () => { 
            return new Promise((resolve,reject)=>{ 
                state.loading = true;
                fetchStaticList()
                .then(res=>{
                    state.list = res;
                }).finally(()=>{
                    state.loading = false;
                    resolve();
                });
            });
        }
        const search = () => { 
            return new Promise((resolve,reject)=>{ 
                state.loading = true;
                fetchStaticSearch().then(res=>{

                }).finally(()=>{
                    state.loading = false;
                    resolve();
                })
            });
        }
        const handleSearch = () => { 
            search().then(()=>{
                getList().then(()=>{
                    ElMessage.success(t('static.reloaded'));
                });
            });
        }
        
        onMounted(()=>{
            getList();
        });

        return {state,handleSearch}
    }
}
</script>
<style lang="stylus" scoped>
html.dark .table-wrap{
    .inner{
        border-color:var(--main-border-color);
        .head{
            border-color:var(--main-border-color);
        }
    }
}
.table-wrap{
    
    overflow hidden;
    padding:2rem;
    box-sizing: border-box;
    
    .inner{
        border:1px solid #e2e8f0e6;
        border-radius:5px;
        box-sizing: border-box;
        

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
