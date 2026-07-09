<template>
    <el-tabs v-model="state.step" type="border-card" class="wizard-tab h-100 bs"  editable @edit="handleStepEdit">
        <el-tab-pane :label="step.stepTitle" :name="step._id" :key="index" v-for="(step,index) in state.steps" class="h-100">
            <el-form ref="ruleFormRef" :model="step.items" label-width="80" class="wizard-form h-100 flex flex-column flex-nowrap">
                <WizardPlusField :step="step"></WizardPlusField>
                <div class="fields flex-1 scrollbar">
                    <template v-if="step.items.length > 0">
                        <el-form-item v-for="(item,index) in step.items" label-width="0" class="field-item mgb-0">
                            <a href="javascript:;" class="action del" @click="handleDelField(step,index)"><el-icon><CircleCloseFilled></CircleCloseFilled></el-icon></a>
                            <a href="javascript:;" class="action add" @click="handleAddField(step,index)"><el-icon><CirclePlusFilled></CirclePlusFilled></el-icon></a>
                            <component :is="choiceComponent(item.type)" :item="item" :types="state.types"></component>
                            <template v-if="item.type != 'tips'">
                                <WizardValidate :item="item" :types="state.types" :vtypes="state.vtypes"></WizardValidate>
                            </template>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label-width="0" >
                            <div class="t-c w-100 mgt-1">
                                <el-button plain @click="handleAddField(step,0)">{{ $t('wizard.addField') }}</el-button>
                            </div>
                        </el-form-item>
                    </template>
                </div>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import {reactive } from 'vue';
import { useLogger } from '../../logger';
import {Edit,CircleCloseFilled,CirclePlusFilled} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
import WizardText from './WizardText.vue';
import WizardOptions from './WizardOptions.vue';
import WizardSwitch from './WizardSwitch.vue';
import WizardTips from './WizardTips.vue';
import WizardValidate from './WizardValidate.vue';
import WizardPlusField from './WizardPlusField.vue';
import { t } from '@/i18n';
export default {
    props: ['type','path','content'],
    components: { Edit,CircleCloseFilled,CirclePlusFilled,WizardValidate,WizardPlusField },
    setup (props,{emit}) {

        const logger = useLogger();

        const validateTypes = [
            {label: t('wizard.required'),value: 'required',default:{_required:true}},
            {label: t('wizard.range'),value: 'min',default:{_min:0,_max:0}},
            {label: t('wizard.length'),value: 'len',default:{_len:0}},
            {label: t('wizard.pattern'),value: 'pattern',default:{_pattern:''}},
        ];
        const types = [
            {label:t('wizard.text'),value:'text',default:'',field:'initValue'},
            {label:t('wizard.password'),value:'password',default:'',field:'initValue'},
            {label:t('wizard.radio'),value:'radio',default:'',field:'initValue'},
            {label:t('wizard.checkbox'),value:'checkbox',default:[],field:'initValue'},
            {label:t('wizard.select'),value:'select',default:'',field:'initValue'},
            {label:t('wizard.switch'),value:'switch',default:true,field:'initValue',init:(value)=>{ return value == 'true' },format:(value)=>{return value.toString()}},
            {label:t('wizard.tips'),value:'tips',default:'',field:'helpText'},
        ];
        const defaultItem = Object.assign({
            type:'text',
            field:'wizard_default',
            label:t('wizard.defaultItem'),
            rules:[],
            options:[]
        }, types.reduce((json,item)=>{
            json[`_${item.value}`] = item.default;
            return json;
        },{}));

        const _default = JSON.parse(props.content == '[]' ? JSON.stringify([{'stepTitle':t('wizard.defaultStep'),'items':[]}]) : props.content);
        
        _default.forEach((step,index)=>{
            step._id = index;
            for(let i = 0; i < step.items.length; i++){
                step.items[i] = Object.assign(JSON.parse(JSON.stringify(defaultItem)),step.items[i]);
                const type = types.filter(c=>c.value == step.items[i].type)[0];
                if(type){
                    step.items[i][`_${step.items[i].type}`] = step.items[i][type.field];
                    if(step.items[i][`_${step.items[i].type}`] !== undefined && type.init){
                        step.items[i][`_${step.items[i].type}`] = type.init(step.items[i][`_${step.items[i].type}`]);
                    }
                }
            }
            step['_plus_field'] = Object.keys(step).filter(c=>['stepTitle','items','_id'].indexOf(c) < 0).map(c=>{
                const value = step[c];
                delete step[c];
                return {
                    field:c,
                    value:value
                }
            });
        });

        const state = reactive({
            step:_default.length > 0 ? _default[0]._id : '',
            steps:_default,
            types:types,
            loading:false,
            vtypes:validateTypes
        });

        const choiceComponent = (type) =>{
            return [WizardText,WizardOptions,WizardSwitch,WizardTips].filter(c=>c.allowTypes.indexOf(type) >= 0)[0];
        };

        const handleStepEdit = (_id,action) => {
            if(action == 'add'){
                ElMessageBox.prompt(t('wizard.addStepPrompt'),t('wizard.addStep'),{
                    confirmButtonText: t('common.ok'),
                    cancelButtonText: t('common.cancel'),
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                }).then(({ value }) => {
                    if(!value) return;
                    const _id = Date.now().toString();
                    state.steps.push({
                        '_id':_id,
                        'stepTitle':value,
                        'items':[],
                        '_plus_field':[],
                    });
                    state.step = _id;
                }).catch((e) => {
                    logger.value.error(`${e}`);
                });
            }else if(action == 'remove'){
                ElMessageBox.confirm(t('wizard.deleteStepConfirm'), t('common.tips'), {
                    confirmButtonText: t('common.ok'),
                    cancelButtonText: t('common.cancel'),
                    type: 'warning',
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                }).then(() => {
                    state.steps = state.steps.filter(item=>item._id != _id);
                    if(state.step == _id && state.steps.length > 0){
                        state.step = state.steps[0]._id;
                    }
                }).catch((e) => {
                    logger.value.error(`${e}`);
                });
            }
        }

        const handleDelField = (step,index)=>{
            if(step.items[index].field == 'wizard_default'){
                step.items.splice(index,1);
                return;
            }
            ElMessageBox.confirm(t('wizard.deleteFieldConfirm', { field: step.items[index].field }), t('common.tips'), {
                confirmButtonText: t('common.ok'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(() => {
                step.items.splice(index,1);
            }).catch((e) => {
                logger.value.error(`${e}`);
            });
        }
        const handleAddField = (step,index) => {
            step.items.splice(index+1,0,JSON.parse(JSON.stringify(defaultItem)));
        }

        const deleteField = (item)=>{
            Object.keys(item).filter(c=>c.startsWith('_')).forEach(c=>{
                delete item[c];
            });
        }
        const getContent = () => {
            return new Promise((resolve,reject)=>{ 
                let arr = JSON.parse(JSON.stringify(state.steps));
                arr.forEach(step=>{

                    if(step._plus_field){
                        step._plus_field.forEach(item=>{
                            step[item.field] = item.value;
                        });
                    }
                    
                    // Remove helper fields from the step.
                    deleteField(step);

                    const items = step.items;
                    delete step.items;
                    step.items = items;
                    step.items.forEach(item=>{
                        // Remove helper fields from the item. Each item type owns one initial-value helper.
                        types.forEach(type=>{
                            if(type.field !== 'helpText')
                                delete item[type.field];
                        });
                        const type = types.filter(c=>c.value == item.type)[0];
                        item[type.field] = item[`_${item.type}`];
                        if(type.format && item[type.field] !== undefined){
                            item[type.field] = type.format(item[type.field]);
                        }
                        deleteField(item);

                        // Remove validation helpers and restore type-specific values to real fields.
                        item.rules = item.rules.reduce((arr,rule)=>{
                            const keys = Object.keys(validateTypes.filter(c=>c.value == rule._type)[0].default);
                            arr.push(Object.assign(keys.reduce((json,value)=>{
                                json[value.replace(/_/g,'')] = rule[value];
                                return json;
                            },{}),{'message':rule[`_${rule._type}_message`]}));
                            return arr;
                        },[]);
                    });
                });
                if(arr.length == 1 && arr[0].items.length == 0){
                    arr = [];
                }
                const content = JSON.stringify(arr,null,2);
                
                resolve({
                    path:props.path,
                    content:content,
                    delete:{
                        value:content=='[]',
                        f:true
                    }
                });
            })
        }


        return {state,choiceComponent,handleStepEdit,handleDelField,handleAddField,getContent}
    }
}
</script>

<style lang="stylus" scoped>
html.dark .wizard-tab{ 
    .field-item{
        &:nth-child(odd){
            background-color:rgba(255,255,255,0.03);
        }
        &:hover{
            background-color:rgba(255,255,255,0.05);
        }
    }
}
.wizard-tab{
    
    .fields{
        border:1px solid var(--main-border-color);
        margin:1rem 0 0 0;
    }
    
    .field-item{
        margin-bottom:1rem;
        border-bottom:1px solid var(--main-border-color);
        padding:.5rem .5rem .5rem 0;
        position:relative;
        &:nth-child(odd){
            background-color:rgba(0,0,0,0.03);
        }
        &:hover{
            background-color:rgba(0,0,0,0.05);
            .action{
                display:block;
            }
        }

        .action{
            display:none;
            position:absolute;
            left:50%;   
            bottom:-2.3rem;
            z-index 999
            &.del{
                color:red;
                margin-left:-2rem;
            }
            &.add{
                color:green;
                margin-left:2rem;
            }
        }
    }
}
</style>
