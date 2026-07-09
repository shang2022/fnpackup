<template>
     <div class="item">
        <el-form label-width="140">
            <el-form-item :label="$t('uiConfig.entryId')">
                <el-input v-model="item._key" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('uiConfig.displayTitle')" prop="title">
                <el-input v-model="item.title" />
            </el-form-item>
            <el-form-item :label="$t('uiConfig.displayIcon')" prop="icon">
                <el-input v-model="item.icon" />
            </el-form-item>
            <el-form-item label="" label-width="0" class="mgb-0">
                <el-row>
                    <el-col :span="9">
                        <el-form-item :label="$t('uiConfig.protocol')" prop="protocol">
                            <el-select v-model="item.protocol">
                                <el-option key="http" label="http" value="http"></el-option>
                                <el-option key="https" label="https" value="https"></el-option>
                                <el-option key="--" :label="$t('uiConfig.autoHttps')" value=""></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('uiConfig.port')" prop="port" label-width="40">
                            <el-input v-model="item.port" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item :label="$t('uiConfig.path')" prop="url" label-width="40">
                            <el-input v-model="item.url" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="">
                <div class="flex w-100">
                    <span>{{ item.protocol || 'http' }}://fn_ip:{{ item.port || '5666' }}{{ item.url }}</span>
                    <span class="flex-1"></span>
                    <span>
                        <el-radio-group v-model="item.type">
                            <el-radio value="url" class="mgr-1">{{ $t('uiConfig.newTab') }}</el-radio>
                            <el-radio value="iframe">{{ $t('uiConfig.iframe') }}</el-radio>
                        </el-radio-group>
                    </span>
                </div>
            </el-form-item>
            <el-form-item :label="$t('uiConfig.gateway')">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('uiConfig.gatewayPrefix')" prop="gatewayPrefix">
                            <el-input v-model="item.gatewayPrefix" placeholder="/app/{appname}" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('uiConfig.gatewaySocket')" prop="gatewaySocket">
                            <el-input v-model="item.gatewaySocket" placeholder="app.sock" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="" v-if="item.gatewayPrefix">
                <div class="flex w-100">
                    {{ item.protocol || 'http' }}://fn_ip:{{ item.port || '5666' }}{{item.gatewayPrefix }} {{ $t('uiConfig.forwardTo') }} /var/apps/{{item._key.split('.')[0]}}/target/{{item.gatewaySocket}}
                </div>
            </el-form-item>
            <el-form-item :label="$t('uiConfig.accessPermission')" prop="allUsers">
                <el-radio-group v-model="item.allUsers">
                    <el-radio :value="true" class="mgr-1">{{ $t('uiConfig.allUsers') }}</el-radio>
                    <el-radio :value="false">{{ $t('uiConfig.adminOnly') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            
            <template v-if="item.allUsers==false">
                <el-form-item label="" label-width="0">
                    <el-row class="w-100">
                        <el-col :span="10">
                            <el-form-item :label="$t('uiConfig.userPermission')" prop="accessPerm">
                                <el-select v-model="item.control.accessPerm">
                                    <el-option key="editable" :label="$t('uiConfig.editable')" value="editable"></el-option>
                                    <el-option key="readonly" :label="$t('uiConfig.readonly')" value="readonly"></el-option>
                                    <el-option key="hidden" :label="$t('uiConfig.hidden')" value="hidden"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </template>
            
            <el-form-item :label="$t('uiConfig.fileContext')" prop="noDisplay">
                <el-radio-group v-model="item.noDisplay">
                    <el-radio :value="true" class="mgr-1">{{ $t('uiConfig.contextOnly') }}</el-radio>
                    <el-radio :value="false">{{ $t('uiConfig.desktopAndContext') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('uiConfig.fileTypes')" prop="fileTypes">
                <el-select v-model="item.fileTypes" filterable clearable allow-create 
                multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="19">
                    <el-option v-for="item in state.fileTypes" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive } from 'vue';
export default {
    props: ['item'],
    setup () {
        const state = reactive({
            fileTypes:[
                "txt", "md", "doc", "docx", "pdf", "rtf", "odt",
                "json", "xml", "csv", "yml", "yaml", "ini", "toml",
                "html", "htm", "css", "js", "py", "java", "cpp", "c", "h", "php",'cs',
                "jpg", "jpeg", "png", "gif", "svg", "bmp", "webp",
                "zip", "rar", "7z", "tar", "gz",
                "mp3", "mp4", "avi", "mov", "wav",
                "exe", "dmg", "iso", "log", "db", "sqlite", "ppt", "pptx", "xls", "xlsx"
            ],
        });
        return {
            state
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>
