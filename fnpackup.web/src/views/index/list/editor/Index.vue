<template>
    <el-dialog v-model="state.show" 
    :width="`${projects.editor.width}px`" :style="`height:${projects.editor.height || '90%'};`"
    :close-on-click-modal="false" :close-on-press-escape="false"  top="1vh"  draggable class="editor-dialog">
        <template #header>
            <div class="header">
                <template v-if="state.changed">
                    <span class="red">{{ $t('editor.title', { remark: projects.editor.remark }) }} <strong >*</strong> </span>
                </template>
                <template v-else>
                    <span>{{ $t('editor.title', { remark: projects.editor.remark }) }}</span>
                </template>
            </div>
        </template>
        <template v-if="state.show">
            <div class="tabs w-100">
                <Editor :path="projects.editor.path" ref="editor"></Editor>
            </div>
            <div class="t-c mgt-1">
                <el-button @click="handleCancel" :loading="state.loading">{{ $t('common.cancel') }}</el-button>
                <el-button  v-if="state.showSave" type="primary" @click="handleSave" :loading="state.loading">{{ $t('editor.saveCurrent') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import {getCurrentInstance, onMounted, onUnmounted, reactive,watch } from 'vue';
import { useProjects } from '../list';
import Editor from './Editor.vue';
import { fetchFileWrite } from '@/api/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useLogger } from '../../logger';
import { t } from '@/i18n';
export default {
    components:{Editor},
    props:['modelValue'],
    setup (props,{emit}) {

        const $this = getCurrentInstance();
        const logger = useLogger();
        const projects = useProjects();
        const state = reactive({
            show:true,
            loading:false,
            content:'',
            changed:false,
            showSave:false,
            showSaveTimer:0
        });
        watch(() => state.show, (val) => {
            if (!val) {
                setTimeout(() => {
                    emit('update:modelValue', val);
                }, 300);
            }
        });

        const handleCancel = () => {
            if(state.changed){
                ElMessageBox.confirm(t('common.unsavedConfirm'), t('common.tips'), {
                    confirmButtonText: t('common.saveAndClose'),
                    cancelButtonText: t('common.closeDirectly'),
                    type: 'warning',
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                })
                .then(()=>{
                    handleSave().then(()=>{
                        state.show = false;
                    });
                }).catch(()=>{
                    state.show = false;
                });
            }else{
                state.show = false;
            }
        }
        const handleSave = () => {
            return new Promise((resolve,reject)=>{
                state.loading = true;
                const _ref = $this.refs[`editor`];
                const getContent = _ref.getContent;
                const setChangedContent = _ref.setChangedContent;

                getContent().then((res)=>{   
                    fetchFileWrite(res.path,res.content)
                    .then((msg)=>{
                        if(msg){
                            ElMessage.error(t('common.saveFailed'));
                            logger.value.error(msg);
                            reject();
                        }else{
                            state.content = res.content;
                            ElMessage.success(t('common.saveSuccess'));
                            logger.value.success(`[${res.path}]${t('common.saveSuccess')}`);
                            if(setChangedContent && res.changed_key){
                                setChangedContent(res.changed_key,res.content);
                            }
                            projects.value.load();
                            resolve();
                        }
                    }).catch(()=>{
                        reject();
                        ElMessage.error(t('common.operationFailed'));
                    }).finally(()=>{
                        state.loading = false;
                    });
                });
            });
        }

        const saveBtnTimer = ()=>{
            clearTimeout(state.showSaveTimer);
            state.showSaveTimer = setTimeout(()=>{
                const _ref = $this.refs[`editor`];
                if(_ref){
                    const getContent = _ref.getContent;
                    getContent().then((res)=>{
                        state.showSave = !!res;
                        if(state.showSave){
                            if(!state.content){
                                state.content = res.content;
                            }else{
                                if(res.changed !== undefined){
                                    state.changed = res.changed;
                                }else{
                                    state.changed = res.content != state.content;
                                }
                            }
                        }
                    });
                }
                saveBtnTimer();
            },500);
        }
        onMounted(()=>{
            saveBtnTimer();
        });
        onUnmounted(()=>{
            clearTimeout(state.showSaveTimer);
        });

        return {projects,state,handleCancel,handleSave}
    }
}
</script>

<style lang="stylus">
.el-overlay-dialog{
    overflow: hidden !important;
}
.editor-dialog{
    max-width: 80%;
    .el-dialog__body{
        height:calc(100% - 4rem);
    }
}
</style>
<style lang="stylus" scoped>
    .tabs{
        height:calc(100% - 4rem );
    }
    .header{
        font-size:1.6rem;
    }
</style>
