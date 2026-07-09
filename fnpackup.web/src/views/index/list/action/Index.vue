<template>
    <div class="actions-wrap">
        <template v-if="paths.length == 0">
            <el-button type="primary" plain size="small" @click="handleCreate"><el-icon><Plus /></el-icon>{{ $t('action.createApp') }}</el-button>
            <el-button plain size="small" @click="handleUpload('.fpk')"><el-icon><Upload /></el-icon>{{ $t('action.importFpk') }}</el-button>
        </template>
        <template v-if="paths.length >= 1">
            <el-button type="primary" plain size="small" @click="handleBuild"><el-icon><Pointer /></el-icon>{{ $t('action.buildFpk') }}</el-button>
            <el-button type="success" plain size="small" @click="handleGuide"><el-icon><Files /></el-icon>{{ $t('action.quickEdit') }}</el-button>     
            <el-button type="warning" plain size="small" @click="handleIcon"><el-icon><Picture /></el-icon>{{ $t('action.iconDesign') }}</el-button>     
            <el-button type="info" plain size="small" @click="handleEnv"><el-icon><MessageBox /></el-icon>{{ $t('action.envVars') }}</el-button> 
        </template>
            
        <Create v-model="projects.editor.create" v-if="projects.editor.create"></Create>
        <UploadFile v-model="projects.editor.upload" v-if="projects.editor.upload"></UploadFile>
    </div>
</template>

<script>
import { Upload,Plus,Files, Pointer, Picture, MessageBox } from '@element-plus/icons-vue'
import { computed } from 'vue';
import { useProjects } from '../list';
import Create from './Create.vue';
import UploadFile from './Upload.vue';
import { t } from '@/i18n';
export default {
    components: {
        Upload,Pointer,Plus,Files,Create,UploadFile,Picture,MessageBox
    },
    setup () {
        const projects = useProjects();
        const paths = computed(()=>projects.value.page.path.split('/').filter(item=>item && item!='.'));
        const handleCreate = ()=>{
            projects.value.editor.create = true;
        }
        const handleBuild = ()=>{
            const name = projects.value.page.path.split('/').filter(item=>item && item!='.')[0];
            projects.value.editor.path =`./${name}/fnpack`;
            projects.value.editor.remark = t('action.packDownload');
            projects.value.editor.show = true;
        }
        const handleGuide = ()=>{
            projects.value.editor.guide = true;
        }
        const handleUpload = (mime)=>{
            projects.value.editor.upload = true;
            projects.value.editor.mime = mime;
        }
        const handleIcon = ()=>{
            projects.value.editor.paint = true;
        }
        const handleEnv = ()=>{
            const name = projects.value.page.path.split('/').filter(item=>item && item!='.')[0];
            projects.value.editor.path =`./${name}/env`;
            projects.value.editor.remark = t('action.envVars');
            projects.value.editor.show = true;
        }

        return {paths,projects,handleCreate,handleBuild,handleGuide,handleUpload,handleIcon,handleEnv}
    }
}
</script>

<style lang="stylus" scoped>
html.dark .actions-wrap{
    border-color:var(--main-border-color);
}
.actions-wrap{
    border-bottom:1px solid #e2e8f0e6;
    padding:.6rem 1rem;
}
</style>
