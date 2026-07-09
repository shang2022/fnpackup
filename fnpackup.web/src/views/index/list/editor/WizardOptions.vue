<template>
    <el-row class="w-100">
        <el-col :span="12">
            <el-form-item :label="$t('wizard.fieldType')">
                <el-select v-model="item.type" :placeholder="$t('wizard.choose')">
                    <el-option v-for="(item) in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> 
        </el-col>
        <el-col :span="12">
            <el-form-item :label="$t('wizard.displayText')">
                <el-input v-model="item.label" ></el-input>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row class="w-100 mgt-1">
        <el-col :span="12">
            <el-form-item :label="$t('wizard.fieldName')">
                <el-input v-model="item.field" ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item :label="$t('wizard.initialValue')" class="relative">
                <template v-if="item.type=='checkbox'">
                    <el-select v-model="item[`_${item.type}`]" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1">
                        <el-option v-for="(option,index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </template>
                <template v-else>
                    <el-select v-model="item[`_${item.type}`]">
                        <el-option v-for="(option,index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </template>
                <a href="javascript:;" class="table" :title="$t('wizard.manageOptions')" @click="handleOptions"><el-icon><Grid></Grid></el-icon></a>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row class="w-100 mgt-1">
        <el-col :span="24">
            <el-form-item :label="$t('wizard.helperText')">
                <el-input v-model="item.helpText" ></el-input>
            </el-form-item>
        </el-col>
    </el-row>
    <el-dialog v-model="state.show" :title="$t('wizard.optionsTitle')" width="400" top="2vh" >
        <div v-if="state.show">
            <div class="head t-c flex">
                <el-button plain size="small" @click="handleAdd(0)">{{ $t('wizard.addOption') }}</el-button>
                <span class="flex-1 t-c">{{ $t('wizard.editTip') }}</span>
                <el-button plain size="small" type="primary" @click="handleSubmit">{{ $t('wizard.saveOptions') }}</el-button>
            </div>
            <el-table :data="state.data" stripe  border size="small" @cell-dblclick="handleCellClick">
                <el-table-column prop="label" :label="$t('wizard.tag')">
                    <template #default="scope">
                        <template v-if="scope.row._label">
                            <el-input size="small" v-model="scope.row.label" @change="handleCellChange(scope.row,'label')" />
                        </template>
                        <template v-else>
                            <span>{{scope.row.label}}</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="value" :label="$t('wizard.value')">
                    <template #default="scope">
                        <template v-if="scope.row._value">
                            <el-input size="small" v-model="scope.row.value" @change="handleCellChange(scope.row,'value')" />
                        </template>
                        <template v-else>
                            <span>{{scope.row.value}}</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" :label="$t('wizard.operation')" min-width="40">
                    <template #default="scope">
                        <el-button link type="danger" size="small" @click="handleDel(scope.$index)"><el-icon><Delete></Delete></el-icon></el-button>
                        <el-button link type="primary" size="small" @click="handleAdd(scope.$index)"><el-icon><Plus></Plus></el-icon></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
import {Grid,Delete,Plus} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
import { reactive } from 'vue';
import { useLogger } from '../../logger';
import { t } from '@/i18n';
export default {
    allowTypes:['radio','checkbox','select'],
    props: ['item','types'],
    components: { Grid,Delete,Plus },
    setup (props) {

        const logger = useLogger();
        const state = reactive({
            show:false,
            data:JSON.parse(JSON.stringify(props.item.options)),
        });

        const handleCellClick = (row, column, cell, event) => {
            row[`_label`] = false;
            row[`_value`] = false;
            row[`_${column.property}`] = true;
        }
        const handleCellChange = (row, property) => {
            row[`_${property}`] = false;
        }
        const handleOptions = () => {
            state.data = props.item.options
            state.show = true;
        }
        const handleAdd = (index = 0) => {
            state.data.splice(index+1,0,{label:'',value:''})
        }
        const handleDel = (index) => {
            if(!state.data[index].label && !state.data[index].value){
                state.data.splice(index,1);
                return;
            }
            ElMessageBox.confirm(t('common.deleteConfirm'), t('common.tips'), {
                confirmButtonText: t('common.ok'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
                draggable:true,
                customStyle: {
                    'vertical-align':'unset'
                },
            }).then(() => {
                state.data.splice(index,1)
            }).catch((e) => {
                logger.value.error(`${e}`)
            });
        }

        const handleSubmit = () => {
            const arr = JSON.parse(JSON.stringify(state.data.filter(c=>c.label && c.value)));
            arr.forEach(c=>{
                delete c[`_label`];
                delete c[`_value`];
            })
            props.item.options = arr;
            state.show = false;
        }

        return {state,handleCellClick,handleCellChange,handleOptions,handleAdd,handleDel,handleSubmit}
    }
}
</script>

<style lang="stylus" scoped>
a.table{
    position: absolute;
    right:-0.5rem;
    top:0rem;
    color: #409eff;
}
</style>
