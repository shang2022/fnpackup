<template>
    <div class="manifest-wrap h-100">
        <el-form ref="ruleFormRef"  :model="state.ruleForm" :rules="state.rules" label-width="180" class="h-100 flex flex-column flex-nowrap">
            <div class="flex-1 inner scrollbar">
                <template v-for="(item,index) in fieldsArray">
                    <el-form-item :label="item.type == 'checkbox'?'':item.label" :prop="item.name">
                        <template #label="{label}">
                            <div>
                                <span>{{ label }}</span>
                                <template v-if="item.help">
                                    <el-popover :title="$t('manifest.hint')" placement="top" width="240">
                                        <template #reference>
                                            <el-icon size="12"><QuestionFilled></QuestionFilled></el-icon>
                                        </template>
                                        <div v-html="item.help"></div>
                                    </el-popover>
                                </template>
                            </div>
                        </template>
                        <template v-if="item.type == 'input'">
                            <el-input v-model="state.ruleForm[item.name]" @change="handleChange(item.name)" />
                        </template>
                        <template v-else-if="item.type == 'textarea'">
                            <el-input type="textarea" 
                            :autosize="{ minRows: 2, maxRows: 6}" resize="none" 
                            v-model="state.ruleForm[item.name]" @change="handleChange(item.name)"/>
                        </template>
                        <template v-else-if="item.type == 'checkbox'">
                            <el-checkbox v-model="state.ruleForm[item.name]" @change="handleChange(item.name)">{{ item.label }}</el-checkbox>
                        </template>
                        <template v-else-if="item.type == 'select'">
                            <template v-if="item.to">
                                <el-row class="w-100">
                                    <el-col :span="24">
                                        <template v-if="item.create">
                                            <el-select v-model="state.ruleForm[item.name]" :remote="item.remote" :filter-method="item.remoteFn || remoteFn"
                                            filterable clearable allow-create 
                                            multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="19" @change="handleChange(item.name)">
                                                <el-option v-for="(option,index) in item.options" :label="option.label" :value="option.value"></el-option>
                                            </el-select>
                                        </template>
                                        <template v-else> 
                                            <el-select v-model="state.ruleForm[item.name]" @change="handleChange(item.name)">
                                                <el-option v-for="(option,index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                                            </el-select>
                                        </template>
                                    </el-col>
                                </el-row>
                            </template>
                            <template v-else>
                                <template v-if="item.create">
                                    <el-select v-model="state.ruleForm[item.name]" :remote="item.remote" :filter-method="item.remoteFn || remoteFn"
                                    filterable clearable allow-create 
                                    multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="19" @change="handleChange(item.name)">
                                        <el-option v-for="(option,index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                </template>
                                <template v-else> 
                                    <el-select v-model="state.ruleForm[item.name]" @change="handleChange(item.name)">
                                        <el-option v-for="(option,index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                </template>
                            </template>
                        </template>

                    </el-form-item>
                </template>
            </div>
        </el-form>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useProjects } from '../list';
import { fetchAppCenter, fetchFileRead, fetchProjectExists } from '@/api/api';
import { useLogger } from '../../logger';
import {  QuestionFilled } from '@element-plus/icons-vue';
import { t } from '@/i18n';

export default {
    match:/manifest$/,
    width:600,
    components:{QuestionFilled},
    props:['path','content'],
    setup (props) {

        const logger = useLogger();
        const projects = useProjects();
        const root = projects.value.page.root.slice();
        const contentJson = props.content.split('\n').reduce((json,item)=>{
            const index = item.indexOf('=');
            if(index>0){
                const key = item.substring(0,index).trim();
                const value = item.substring(index+1).trim();

                if(key == 'install_dep_apps'){
                    json[key] = value.split(':').filter(c=>c);
                }else{
                    json[key] = value;
                }
            }
            return json;
        },{});
        delete contentJson['arch'];


        const staticHelp = [
            t('manifest.staticHelp1'),
            `{appname}.domain.com:${window.location.port}<br>`,
            `domain.com:${window.location.port}/{appname}<br>`,
            t('manifest.staticHelp4')
        ];

        const fieldsArray = ref([
            {name: 'appname', label: t('manifest.fields.appname'), type: 'input',default:'',rules:[{required: true, message: t('manifest.rules.appname'), trigger: 'blur'}]},
            {name: 'version', label: t('manifest.fields.version'), type: 'input',default:'0.0.1',rules:[{required: true, message: t('manifest.rules.version'), trigger: 'blur'}]},
            {name: 'display_name', label: t('manifest.fields.displayName'), type: 'input',default:'',rules:[{required: true, message: t('manifest.rules.displayName'), trigger: 'blur'}]},
            {name: 'desc', label: t('manifest.fields.desc'), type: 'textarea',default:'',rules:[{required: true, message: t('manifest.rules.desc'), trigger: 'blur'}]},
            { name: 'platform', label: t('manifest.fields.platform'), type: 'select',  default:'x86',
                options: [
                    {label: t('manifest.any'), value: 'all'},
                    {label: t('manifest.onlyX86'), value: 'x86'},
                    {label: t('manifest.onlyArm'), value: 'arm'},
                    {label: t('manifest.onlyLoongarch'), value: 'loongarch'},
                    {label: t('manifest.onlyRiscv'), value: 'risc-v'},
                ]
            },
            {name: 'source', label: t('manifest.fields.source'), type: 'select', options: [{label: t('manifest.thirdparty'), value: 'thirdparty'}],default:'thirdparty'},
            {name: 'maintainer', label: t('manifest.fields.maintainer'), type: 'input',default:'',rules:[{required: true, message: t('manifest.rules.maintainer'), trigger: 'blur'}]},
            {name: 'maintainer_url', label: t('manifest.fields.maintainerUrl'), type: 'input',default:''},
            {name: 'distributor', label: t('manifest.fields.distributor'), type: 'input',default:'',rules:[{required: true, message: t('manifest.rules.distributor'), trigger: 'blur'}]},
            {name: 'distributor_url', label: t('manifest.fields.distributorUrl'), type: 'input',default:''},
            {name: 'os_min_version', label: t('manifest.fields.osMinVersion'), type: 'input',default:''},
            {name: 'os_max_version', label: t('manifest.fields.osMaxVersion'), type: 'input',default:''},
            {name: 'ctl_stop', label: t('manifest.fields.ctlStop'), type: 'checkbox',default:true},
            {name: 'install_type', label: t('manifest.fields.installType'), type: 'select',options:[{label: t('manifest.appUser'), value: ' '},{label: t('manifest.rootUser'), value: 'root'}],default:' '},
            {name: 'install_dep_apps', label: t('manifest.fields.installDepApps'), type: 'select',options:[],create:true,remote:true,remoteFn:(query)=>{
                fetchAppCenter(query)
                .then(res => {
                    if(res.code == 0){
                        fieldsArray.value[fieldsArray.value.findIndex(c=>c.name == 'install_dep_apps')].options = res.data.list.map(c=>{
                            return {label:c.name,value:c.appName};
                        });
                        return;
                    }
                    logger.value.error(res.msg);
                });
            },default:''},
            {name: 'desktop_uidir', label: t('manifest.fields.desktopUidir'), type: 'input',default:'ui'},
            {name: 'desktop_applaunchname', label: t('manifest.fields.desktopApplaunchname'),  type: 'select',options:[],default:''},
            {name: 'service_port', label: t('manifest.fields.servicePort'), type: 'input',default:''},
            {name: 'checkport', label: t('manifest.fields.checkport'), type: 'checkbox',default:true},
            {name: 'disable_authorization_path', label: t('manifest.fields.disableAuthorizationPath'), type: 'checkbox',default:false},
            {name: 'fnpackup', label: t('manifest.fields.fnpackup'), type: 'input',default:'',help:staticHelp.join('')},
            {name: 'changelog', label: t('manifest.fields.changelog'), type: 'input',default:''},
            
        ]);
        const rules = fieldsArray.value.reduce((json,item)=>{
            if(item.rules)
                json[item.name] = item.rules;
            return json;
        },{});
        const defaultJosn = fieldsArray.value.reduce((json,item)=>{
            if(item.name == 'install_dep_apps'){
                json[item.name] = item.default.split(':').filter(c=>c);
            }else{
                json[item.name] = item.default;
            }
            return json;
        },{});

        const json = Object.assign(defaultJosn,contentJson);
        json.ctl_stop = json.ctl_stop === 'true' || json.ctl_stop === true || json.ctl_stop === undefined;
        json.checkport = json.checkport == 'true'  || json.checkport === true;
        json.disable_authorization_path = json.disable_authorization_path === 'true' || json.disable_authorization_path === true;
        json.desc = json.desc.replace(/^"""|"""$/g,'');
        const state = reactive({
            ruleForm: json,
            rules: rules,
            loading: false,
            apps:[]
        });

        const handleChange = (name)=>{
            if(name == 'desktop_uidir'){
                readUiEndpoint();
            }
        }

        const readUiEndpoint = ()=>{
            fetchFileRead(`${projects.value.page.path.split('/')[1]}/app/${state.ruleForm.desktop_uidir}/config`)
            .then(res => {
                if(!res) return;
                res = JSON.parse(res); 
                fieldsArray.value.filter(c=>c.name == 'desktop_applaunchname')[0].options = Object.keys(res['.url']).map(c=>{
                    return {label:c,value:c}
                });
            }).catch((e)=>{
                fieldsArray.value.filter(c=>c.name == 'desktop_applaunchname')[0].options = [];
                logger.value.error(`${e}`);
            })
        }
        const remoteFn = ()=>{ 
        }

        const ruleFormRef = ref(null);
        const getContent = ()=>{
            return new Promise((resolve,reject)=>{ 
                ruleFormRef.value.validate(valid => {
                    if (!valid){
                        reject();
                    } else {
                        const json = JSON.parse(JSON.stringify(state.ruleForm));
                        json.install_dep_apps = json.install_dep_apps.join(':');

                        const content = Object.keys(json).reduce((arr,item)=>{
                            let value = json[item];
                            if(typeof value == 'string'){
                                value = value.trim();
                            }
                            if(value !== '' && value !== undefined){
                                if(item == 'desc'){
                                    value  = `"""${value}"""`
                                }
                                arr.push(`${item}=${value}`);
                            }
                            return arr;
                        },[]).join('\n');
                        resolve({
                            content: content,
                            path: props.path
                        });
                    }
                })
            });
        }

        onMounted(()=>{
            readUiEndpoint();
            
            fetchAppCenter('',state.ruleForm.install_dep_apps.join(':'))
            .then(res => {
                if(res.code == 0){
                    fieldsArray.value[fieldsArray.value.findIndex(c=>c.name == 'install_dep_apps')].options = res.data.list.map(c=>{
                        return {label:c.name,value:c.appName};
                    });
                    return;
                }
                logger.value.error(res.msg);
            });
            
            fetchProjectExists(root[1]).then(res=>{
                if(res.ui == false){
                    state.ruleForm.desktop_uidir = contentJson.desktop_uidir || '';
                    state.ruleForm.desktop_applaunchname = contentJson.desktop_applaunchname || '';
                }
            });
        })
    
        return {state,fieldsArray,ruleFormRef,handleChange,remoteFn,getContent}
    }
}
</script>

<style lang="stylus" scoped>
.manifest-wrap{
    .inner{
        padding:2rem 1rem;
        border:1px solid var(--main-border-color);
        border-radius:5px;
    }
}
</style>
