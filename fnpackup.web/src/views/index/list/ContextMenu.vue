<template>
    <div class="context-menu-wrap" :style="{left:`${projects.contextMenu.x+4}px`,top:`${projects.contextMenu.y+4}px`}">
        <a href="javascript:;" @click="handleRefresh"><el-icon><Refresh/></el-icon> {{ $t('context.refresh') }}</a>
        <a href="javascript:;" v-if="hasInProject">
            <div class="item">
                <span><el-icon><More/></el-icon>{{ $t('context.directory') }}</span>
                <span class="flex-1"></span>
                <el-icon><ArrowRight/></el-icon>
            </div>
            <div class="sub">
                <a href="javascript:;" @click="handleBack"><el-icon><Back/></el-icon>{{ $t('context.backParent') }}</a>
                <a href="javascript:;" @click="handleHome"><el-icon><Back/></el-icon>{{ $t('context.backAppList') }}</a>
            </div>
        </a>
        <template v-if="canRun">
            <a href="javascript:;" @click="handleRun"><el-icon><VideoPlay/></el-icon>{{ $t('context.run') }}</a>
        </template>
        <template v-if="hasInProject">
            <a href="javascript:;" @click="handleUpload('*/*')"><el-icon><Upload/></el-icon>{{ $t('context.upload') }}</a>
        </template>
        <a href="javascript:;" @click="handleDownload"><el-icon><Download/></el-icon>{{ $t('context.download') }}</a>
        <a href="javascript:;" v-if="canSource" @click="handleSource"><el-icon><Edit/></el-icon>{{ $t('context.sourceEdit') }}</a>
        <a href="javascript:;" v-if="canRename" @click="handleRename"><el-icon><EditPen/></el-icon>{{ $t('context.rename') }}</a>
        <a href="javascript:;">
            <div class="item">
                <span><el-icon><Plus/></el-icon>{{ $t('context.create') }}</span>
                <span class="flex-1"></span>
                <el-icon><ArrowRight/></el-icon>
            </div>
            <div class="sub">
                <template v-if="hasInProject">
                    <a href="javascript:;" @click="handleCreateFile(true)"><el-icon><DocumentAdd/></el-icon>{{ $t('context.newFile') }}</a>
                    <a href="javascript:;" @click="handleCreateFile(false)"><el-icon><FolderAdd/></el-icon>{{ $t('context.newFolder') }}</a>
                </template>
                <template v-else>
                    <a href="javascript:;" @click="handleCreate()"><el-icon><Plus/></el-icon>{{ $t('action.createApp') }}</a>
                    <a href="javascript:;" @click="handleUpload('.fpk')"><el-icon><Upload/></el-icon>{{ $t('action.importFpk') }}</a>
                </template>
            </div>
        </a>
        
        <template v-if="projects.contextMenu.row">
            <a href="javascript:;" class="red" @click="handleDel"><el-icon><Delete/></el-icon>{{ $t('context.delete') }}</a>
        </template>
    </div>
</template>

<script>
import {Refresh,Upload,Download,DocumentAdd,FolderAdd,Delete,EditPen, Plus, Back, ArrowRight, More, Edit, VideoPlay} from '@element-plus/icons-vue'
import { useProjects } from './list';
import { computed, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useLogger } from '../logger';
import { fetchFileCreate, fetchFileDelete, fetchFileRename, fetchProjectBuild } from '@/api/api';
import { t } from '@/i18n';
export default {
    components: {Refresh,Upload,Download,DocumentAdd,FolderAdd,Delete,EditPen,Plus,Back,ArrowRight,More,Edit,VideoPlay},
    setup () {

        const logger = useLogger();
        const projects = useProjects();

        const canSource = computed(()=>projects.value.contextMenu.row && projects.value.contextMenu.row.if);
        const canRename = computed(()=>!!projects.value.contextMenu.row);
        const hasInProject = computed(()=>projects.value.page.path != './');
        const canRun = computed(()=>{
            return false;
            /*
            return projects.value.contextMenu.row 
            && projects.value.contextMenu.row.if
            && projects.value.page.path.split('/').length == 3
            && projects.value.page.path.endsWith('building')
            && ['.ps1','.sh','.bat'].filter(c=>projects.value.contextMenu.row.name.endsWith(c)).length > 0
            */
        });

        const handleRefresh = ()=>{
            projects.value.load();
        }
        const handleCreate = ()=>{
            projects.value.editor.create = true;
        }

        const handleBack = ()=>{
            projects.value.page.path = projects.value.page.path.replace(/\/[^\/]+$/,'');
            projects.value.load();
        }
        const handleHome = ()=>{
            projects.value.page.path = './';
            projects.value.load();
        }
        const handleUpload = (mime)=>{
            projects.value.editor.upload = true;
            projects.value.editor.mime = mime;
        }
        const handleDownload = ()=>{
            let href = process.env.NODE_ENV === 'development' 
            ? `http://localhost:1069/file/download?path=${projects.value.page.path}`
            :  window.location.href.indexOf('index.cgi')>=0 
            ? `/cgi/ThirdParty/fnpackup/index.cgi/file/download?path=${projects.value.page.path}`
            :`/file/download?path=${projects.value.page.path}`;
            if(projects.value.contextMenu.row){
                href = `${href}/${projects.value.contextMenu.row.name}`;
            }
            const a = document.createElement('a');
            a.href = href;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        const handleCreateFile = (isFile)=>{
            ElMessageBox.prompt(t('common.inputName'), isFile ? t('context.newFile') : t('context.newFolder'), {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(({ value }) => {
                if(!value) {
                    return;
                }
                fetchFileCreate(`${projects.value.page.path}/${value}`,isFile)
                .then((res)=>{
                    if(res){
                        logger.value.error(res);
                    }else{
                        logger.value.success(t('common.createSuccess', { name: value }));
                        projects.value.load(); 
                    }
                });
            }).catch((e) => {
                logger.value.error(`${e}`);
            });
        }
        const handleRename = ()=>{
            ElMessageBox.prompt(t('common.inputName'), t('context.rename'), {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                inputValue: projects.value.contextMenu.row.name,
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(({ value }) => {
                if(!value) {
                    return;
                }
                fetchFileRename(`${projects.value.page.path}/${projects.value.contextMenu.row.name}`,
                `${projects.value.page.path}/${value}`,
                projects.value.contextMenu.row.if).then((res)=>{
                    if(res){
                        logger.value.error(res);
                    }else{
                        logger.value.success(t('common.renameSuccess', { name: projects.value.contextMenu.row.name }));
                        projects.value.load(); 
                    }
                }).catch((e)=>{
                    logger.value.error(`${e}`);
                });
            }).catch((e) => {
                logger.value.error(`${e}`);
            });
        }
        const handleDel = ()=>{
            ElMessageBox.confirm(t('common.deleteConfirm'), t('common.tips'), {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(() => {
                fetchFileDelete(`${projects.value.page.path}/${projects.value.contextMenu.row.name}`,projects.value.contextMenu.row.if)
                .then((res)=>{
                    if(res){
                        logger.value.error(res);
                    }else{
                        logger.value.success(t('common.deleteSuccess', { name: projects.value.contextMenu.row.name }));
                        projects.value.load(); 
                    }
                }).catch((e)=>{
                    logger.value.error(`${e}`);
                });
            })
        }

        const handleRun = ()=>{
            const name = projects.value.page.name;
            const file = projects.value.contextMenu.row.name;
            fetchProjectBuild(name,`${file}`);
        }

        const handleSource = ()=>{
            projects.value.editor.path = `${projects.value.page.path}/${projects.value.contextMenu.row.name}`;
            projects.value.editor.remark = projects.value.contextMenu.row.remark;
            projects.value.editor.source = true;
        }

        onMounted(()=>{
            document.addEventListener('click',(e)=>{
                projects.value.contextMenu.show = false;
            });
        });

        return {projects,canSource,hasInProject,canRename,canRun,
            handleRefresh,handleCreate,handleBack,handleHome,handleUpload,handleDownload,
            handleCreateFile,handleDel,handleSource,handleRename,handleRun}
    }
}
</script>

<style lang="stylus" scoped>
html.dark .context-menu-wrap{
    background-color: #1a1e23;
    a{
        border-bottom-color: var(--main-border-color);
        color: var(--main-text-color);
        &:hover{
            background-color: #3f4955;
        }
    }
    .sub{
        background-color: #1a1e23;
    }
}
.context-menu-wrap{
    position: fixed;
    left:0;
    top:0;
    background-color: rgba(255,255,255,1);
    border: 1px solid var(--main-border-color);
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    z-index 99999;
    border-radius: 5px;
    min-width: 10rem;

    a{
        display: block;
        padding: 5px 10px;
        cursor: pointer;
        font-size:1.3rem;
        position: relative;
        white-space : nowrap;
        border-bottom: 1px solid #f5f5f5;
        &:last-child{
            border-bottom: none;
        }

        .el-icon{
            margin-right: 5px;
        }

        .item{
            display:flex
            justify-content: center;
            align-items: center;
        }

        .sub{
            position: absolute;
            left: 100%;
            top: 0;
            background-color: rgba(255,255,255,1);
            border: 1px solid var(--main-border-color);
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
            z-index 99999;
            border-radius: 5px;
            display: none;
        }

        &:hover{
            background-color: #eee;
            .sub{
                display: block;
            }
        }
    }
}
</style>
