<template>
    <div class="env-wrap h-100 scrollbar">
        <el-descriptions title="manifest" :column="1" size="small" border class="w-100 mgb-2" :label-width="80">
            <template v-for="item in state.manifest" :key="item.value">
                <el-descriptions-item  :label="item.value">{{item.label}}</el-descriptions-item>
            </template>
        </el-descriptions>
        <template v-for="item in state.wizards">
            <el-descriptions :title="item.title" :column="1" size="small" border class="w-100 mgb-2" :label-width="80">
                <template v-for="item in item.items" :key="item.value">
                    <el-descriptions-item  :label="item.value">{{item.label}}</el-descriptions-item>
                </template>
            </el-descriptions>
        </template>
        <template v-for="item in state.list">
            <el-descriptions :title="item.title" :column="1" size="small" border class="w-100 mgb-2" :label-width="80">
                <template v-for="item in item.items" :key="item.value">
                    <el-descriptions-item  :label="item.value">{{item.label}}</el-descriptions-item>
                </template>
            </el-descriptions>
        </template>
    </div>
</template>

<script>
import { fetchFileRead } from '@/api/api';
import { onMounted, reactive } from 'vue';
import { useProjects } from '../list';
import { t } from '@/i18n';

export default {
    match:/env$/,
    width:550,
    setup () {
        const projects = useProjects();
        const name = projects.value.page.path.split('/').filter(item=>item && item!='.')[0];
        const state = reactive({
            list:[
                {
                    "title": t('env.basic'),
                    "items": [
                        {
                            "value": "${TRIM_APPNAME}",
                            "label": t('env.appname')
                        },
                        {
                            "value": "${TRIM_APPVER}",
                            "label": t('env.version')
                        },
                        {
                            "value": "${TRIM_OLD_APPVER}",
                            "label": t('env.oldVersion')
                        }
                    ]
                },
                {
                    "title": t('env.pathInfo'),
                    "items": [
                        {
                            "value": "${TRIM_APPDEST}",
                            "label": t('env.appDest')
                        },
                        {
                            "value": "${TRIM_PKGETC}",
                            "label": t('env.pkgEtc')
                        },
                        {
                            "value": "${TRIM_PKGVAR}",
                            "label": t('env.pkgVar')
                        },
                        {
                            "value": "${TRIM_PKGTMP}",
                            "label": t('env.pkgTmp')
                        },
                        {
                            "value": "${TRIM_PKGHOME}",
                            "label": t('env.pkgHome')
                        },
                        {
                            "value": "${TRIM_PKGMETA}",
                            "label": t('env.pkgMeta')
                        },
                        {
                            "value": "${TRIM_APPDEST_VOL}",
                            "label": t('env.appDestVol')
                        }
                    ]
                },
                {
                    "title": t('env.network'),
                    "items": [
                        {
                            "value": "${TRIM_SERVICE_PORT}",
                            "label": t('env.servicePort')
                        }
                    ]
                },
                {
                    "title": t('env.userPermission'),
                    "items": [
                        {
                            "value": "${TRIM_USERNAME}",
                            "label": t('env.username')
                        },
                        {
                            "value": "${TRIM_GROUPNAME}",
                            "label": t('env.groupname')
                        },
                        {
                            "value": "${TRIM_UID}",
                            "label": t('env.uid')
                        },
                        {
                            "value": "${TRIM_GID}",
                            "label": t('env.gid')
                        },
                        {
                            "value": "${TRIM_RUN_USERNAME}",
                            "label": t('env.runUsername')
                        },
                        {
                            "value": "${TRIM_RUN_GROUPNAME}",
                            "label": t('env.runGroupname')
                        },
                        {
                            "value": "${TRIM_RUN_UID}",
                            "label": t('env.runUid')
                        },
                        {
                            "value": "${TRIM_RUN_GID}",
                            "label": t('env.runGid')
                        }
                    ]
                },
                {
                    "title": t('env.dataShare'),
                    "items": [
                        {
                            "value": "${TRIM_DATA_SHARE_PATHS}",
                            "label": t('env.dataSharePaths')
                        }
                    ]
                },
                {
                    "title": t('env.tempLog'),
                    "items": [
                        {
                            "value": "${TRIM_TEMP_LOGFILE}",
                            "label": t('env.tempLogfile')
                        },
                        {
                            "value": "${TRIM_TEMP_UPGRADE_FOLDER}",
                            "label": t('env.tempUpgradeFolder')
                        },
                        {
                            "value": "${TRIM_PKGINST_TEMP_DIR}",
                            "label": t('env.pkginstTempDir')
                        },
                        {
                            "value": "${TRIM_TEMP_TPKFILE}",
                            "label": t('env.tempTpkfile')
                        }
                    ]
                },
                {
                    "title": t('env.cmdScript'),
                    "items": [
                        {
                            "value": "${TRIM_APP_STATUS}",
                            "label": t('env.appStatus')
                        }
                    ]
                },
                {
                    "title": t('env.authPath'),
                    "items": [
                        {
                            "value": "${TRIM_DATA_ACCESSIBLE_PATHS}",
                            "label": t('env.dataAccessiblePaths')
                        }
                    ]
                },
                {
                    "title": t('env.versionInfo'),
                    "items": [
                        {
                            "value": "${TRIM_SYS_VERSION}",
                            "label": t('env.sysVersion')
                        },
                        {
                            "value": "${TRIM_SYS_VERSION_MAJOR}",
                            "label": t('env.sysVersionMajor')
                        },
                        {
                            "value": "${TRIM_SYS_VERSION_MINOR}",
                            "label": t('env.sysVersionMinor')
                        },
                        {
                            "value": "${TRIM_SYS_VERSION_BUILD}",
                            "label": t('env.sysVersionBuild')
                        }
                    ]
                },
                {
                    "title": t('env.sysFeature'),
                    "items": [
                        {
                            "value": "${TRIM_SYS_ARCH}",
                            "label": t('env.sysArch')
                        },
                        {
                            "value": "${TRIM_KERNEL_VERSION}",
                            "label": t('env.kernelVersion')
                        },
                        {
                            "value": "${TRIM_SYS_MACHINE_ID}",
                            "label": t('env.machineId')
                        },
                        {
                            "value": "${TRIM_SYS_LANGUAGE}",
                            "label": t('env.sysLanguage')
                        }
                    ]
                }
            ],
            manifest:[],
            wizards:[]
        });

        const getManifest = () => {
            fetchFileRead(`./${name}/manifest`)
            .then((res)=>{
                state.manifest = res.split('\n').reduce((arr,item)=>{
                    const index = item.indexOf('=');
                    if(index>0){
                        const value = item.substring(0,index).trim();
                        const label = item.substring(index+1).trim();
                        arr.push({value:`\$\{${value}\}`,label});
                    }
                    return arr;
                },[]);
            }).catch(()=>{})
        }
        const getWizard = (filename,title) => {
            return new Promise((resolve,reject)=>{
                fetchFileRead(`./${name}/wizard/${filename}`)
                .then((res)=>{
                    resolve(JSON.parse(res).map(c=>{
                        return {title:`${title}-${c.stepTitle}`,items:c.items.map(c=>{
                            return {
                                label:c.label,
                                value:`\$\{${c.field}\}`
                            }
                        })};
                    }))
                }).catch(()=>{
                    resolve()
                }) 
            });
        }
        const getWizards = () => {
            return Promise.all([
                getWizard('install',t('wizard.install')),
                getWizard('uninstall',t('wizard.uninstall')),
                getWizard('upgrade',t('wizard.upgrade')),
                getWizard('config',t('wizard.config'))
            ]).then(res=>{
                state.wizards = res.filter(c=>c).reduce((arr,item)=>{
                    arr.push(...item);
                    return arr;
                },[]);
            });
        }

        onMounted(()=>{
            getManifest();
            getWizards();
        })
        

        return {state}
    }
}
</script>

<style lang="stylus" scoped>
.env-wrap{
    padding:1rem;
    border:1px solid var(--main-border-color);
    box-sizing:border-box;
    border-radius:5px;
}
</style>
