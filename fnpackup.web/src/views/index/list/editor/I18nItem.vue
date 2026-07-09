<template>
    <el-tabs v-model="state.key" type="border-card" class="h-100 ui-tab"  :editable="content._editable" @edit="handleEdit">
        <template :key="key" v-for="(value,key) in content">
            <el-tab-pane :label="key" :name="key"  class="h-100" v-if="!key.includes('_')">
                <div class="h-100 scrollbar">
                    <el-descriptions :column="1" size="small" border label-width="10rem">
                        <template v-for="(item,index) in value">
                            <el-descriptions-item>
                                <template #label>
                                    <span>{{ item.key }}</span>
                                </template>
                                <div class="flex">
                                    <div class="flex-1"><el-input v-model="item.value"></el-input></div>
                                    <div class="pdl-10" v-if="content._editable">
                                        <el-button @click="handleAdd(key,index)"><el-icon><Plus></Plus></el-icon></el-button>
                                        <el-button @click="handleDel(key,index)" type="danger"><el-icon><Delete></Delete></el-icon></el-button>
                                    </div>
                                </div>
                            </el-descriptions-item>
                        </template>
                    </el-descriptions>
                    <div class="mgt-1 t-c" v-if="content._editable"><el-button @click="handleAdd(key,value.length)"><el-icon><Plus></Plus></el-icon></el-button></div>
                </div>
            </el-tab-pane>
        </template>
    </el-tabs>
</template>

<script>
import { ElMessageBox } from 'element-plus';
import { reactive } from 'vue';
import { useLogger } from '../../logger';
import { Plus,Delete } from '@element-plus/icons-vue';
export default {
    props: ['content'],
    components:{Plus,Delete},
    setup (props,{emit}) {

        const logger = useLogger();
        const keys = Object.keys(props.content).filter(c=>!c.includes('_'));
        const state = reactive({
            key:keys[0] || ''
        });


        const handleEdit = (_id,action) => {
            if(action == 'add'){
                ElMessageBox.prompt(`输入分组名`, '添加分组', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                }).then(({ value }) => {
                    if(!value) {
                        return;
                    }
                    props.content[value] = [];
                    emit('change')
                }).catch((e) => {
                    logger.value.error(`${e}`);
                })
            }else if(action == 'remove'){
                ElMessageBox.confirm('确定要删除该分组吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                }).then(() => {
                    delete props.content[_id];
                    const keys = Object.keys(props.content).filter(c=>!c.includes('_'));
                    if(state.key == _id && keys.length > 0){
                        state.key = keys[0];
                    }
                    emit('change');
                }).catch((e) => {
                    logger.value.error(`${e}`);
                });
            }
        }
        const handleAdd = (key,index)=>{
            ElMessageBox.prompt(`输入字段名`, '添加字段', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(({ value }) => {
                if(!value) {
                    return;
                }
                props.content[key].splice(index+1,0,{key:value,value:''});
                emit('change')
            }).catch((e) => {
                logger.value.error(`${e}`);
            })
           
        }
        const handleDel = (key,index)=>{
            ElMessageBox.confirm(`确定要删除[${key}]字段吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(() => {
                props.content[key].splice(index,1);
                emit('change')
            }).catch((e) => {
                logger.value.error(`${e}`);
            });
        }

        return {
            state,handleEdit,handleAdd,handleDel
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>