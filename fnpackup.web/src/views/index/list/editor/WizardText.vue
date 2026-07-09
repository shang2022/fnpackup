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
            <el-form-item :label="$t('wizard.initialValue')">
                <el-input v-model="item[`_${item.type}`]" ></el-input>
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
</template>

<script>
export default {
    allowTypes:['text','password'],
    props: ['item','types'],
    setup (props) {

        return {}
    }
}
</script>

<style lang="stylus" scoped>

</style>
