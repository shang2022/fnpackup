<template>
    <el-tabs v-model="state.key" type="border-card" class="h-100 ui-tab"  editable @edit="handleEdit" @tab-change="handleChange">
        <el-tab-pane :label="`${value}(${state.labels[value]})`" :name="value" :key="index" v-for="(value,index) in state.keys" class="h-100">
            <template #label>
                <template v-if="state.changeds[value]">
                    <div class="red">{{ value }} <strong >*</strong> </div>
                </template>
                <template v-else>
                    <span>{{ value }}</span>
                </template>
            </template>
            <el-form ref="ruleFormRef" label-width="80" class="ui-form h-100 flex flex-column flex-nowrap">
                <div class="fields flex-1 scrollbar mgb-1">
                    <I18nItem v-if="state.content[value]" :content="state.content[value]" :ref="`i18n-${value}`" @change="handleItemChange(value)"></I18nItem>
                </div>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import {getCurrentInstance, h, onMounted, onUnmounted, reactive } from 'vue';
import { useLogger } from '../../logger';
import { ElMessageBox, ElOption, ElSelect } from 'element-plus';
import I18nItem from './I18nItem.vue';
import { fetchFileCreate, fetchFileDelete, fetchFileList, fetchFileRead } from '@/api/api';
import { useProjects } from '../list';
export default {
    match:/i18n/,
    width:550,
    height:660,
    components: {I18nItem},
    props:['path','content'],
    setup (props,{emit}) {

        const defaultLanguage = 'en-US';

const local_cn = {
  "af": "南非语",
  "af-ZA": "南非语",
  "ar": "阿拉伯语",
  "ar-AE": "阿拉伯语(阿联酋)",
  "ar-BH": "阿拉伯语(巴林)",
  "ar-DZ": "阿拉伯语(阿尔及利亚)",
  "ar-EG": "阿拉伯语(埃及)",
  "ar-IQ": "阿拉伯语(伊拉克)",
  "ar-JO": "阿拉伯语(约旦)",
  "ar-KW": "阿拉伯语(科威特)",
  "ar-LB": "阿拉伯语(黎巴嫩)",
  "ar-LY": "阿拉伯语(利比亚)",
  "ar-MA": "阿拉伯语(摩洛哥)",
  "ar-OM": "阿拉伯语(阿曼)",
  "ar-QA": "阿拉伯语(卡塔尔)",
  "ar-SA": "阿拉伯语(沙特阿拉伯)",
  "ar-SY": "阿拉伯语(叙利亚)",
  "ar-TN": "阿拉伯语(突尼斯)",
  "ar-YE": "阿拉伯语(也门)",
  "az": "阿塞拜疆语",
  "az-AZ": "阿塞拜疆语(西里尔文)",
  "be": "比利时语",
  "be-BY": "比利时语",
  "bg": "保加利亚语",
  "bg-BG": "保加利亚语",
  "bs-BA": "波斯尼亚语(拉丁文，波斯尼亚和黑塞哥维那)",
  "ca": "加泰隆语",
  "ca-ES": "加泰隆语",
  "cs": "捷克语",
  "cs-CZ": "捷克语",
  "cy": "威尔士语",
  "cy-GB": "威尔士语",
  "da": "丹麦语",
  "da-DK": "丹麦语",
  "de": "德语",
  "de-AT": "德语(奥地利)",
  "de-CH": "德语(瑞士)",
  "de-DE": "德语(德国)",
  "de-LI": "德语(列支敦士登)",
  "de-LU": "德语(卢森堡)",
  "dv": "第维埃语",
  "dv-MV": "第维埃语",
  "el": "希腊语",
  "el-GR": "希腊语",
  "en": "英语",
  "en-AU": "英语(澳大利亚)",
  "en-BZ": "英语(伯利兹)",
  "en-CA": "英语(加拿大)",
  "en-CB": "英语(加勒比海)",
  "en-GB": "英语(英国)",
  "en-IE": "英语(爱尔兰)",
  "en-IN": "英语(印度)",
  "en-JM": "英语(牙买加)",
  "en-NZ": "英语(新西兰)",
  "en-PH": "英语(菲律宾)",
  "en-TT": "英语(特立尼达)",
  "en-US": "英语(美国)",
  "en-ZA": "英语(南非)",
  "en-ZW": "英语(津巴布韦)",
  "eo": "世界语",
  "es": "西班牙语",
  "es-AR": "西班牙语(阿根廷)",
  "es-BO": "西班牙语(玻利维亚)",
  "es-CL": "西班牙语(智利)",
  "es-CO": "西班牙语(哥伦比亚)",
  "es-CR": "西班牙语(哥斯达黎加)",
  "es-DO": "西班牙语(多米尼加共和国)",
  "es-EC": "西班牙语(厄瓜多尔)",
  "es-ES": "西班牙语(国际)",
  "es-GT": "西班牙语(危地马拉)",
  "es-HN": "西班牙语(洪都拉斯)",
  "es-MX": "西班牙语(墨西哥)",
  "es-NI": "西班牙语(尼加拉瓜)",
  "es-PA": "西班牙语(巴拿马)",
  "es-PE": "西班牙语(秘鲁)",
  "es-PR": "西班牙语(波多黎各(美))",
  "es-PY": "西班牙语(巴拉圭)",
  "es-SV": "西班牙语(萨尔瓦多)",
  "es-UY": "西班牙语(乌拉圭)",
  "es-VE": "西班牙语(委内瑞拉)",
  "et": "爱沙尼亚语",
  "et-EE": "爱沙尼亚语",
  "eu": "巴士克语",
  "eu-ES": "巴士克语",
  "fa": "法斯语",
  "fa-IR": "法斯语",
  "fi": "芬兰语",
  "fi-FI": "芬兰语",
  "fo": "法罗语",
  "fo-FO": "法罗语",
  "fr": "法语",
  "fr-BE": "法语(比利时)",
  "fr-CA": "法语(加拿大)",
  "fr-CH": "法语(瑞士)",
  "fr-FR": "法语(法国)",
  "fr-LU": "法语(卢森堡)",
  "fr-MC": "法语(摩纳哥)",
  "gl": "加里西亚语",
  "gl-ES": "加里西亚语",
  "gu": "古吉拉特语",
  "gu-IN": "古吉拉特语",
  "he": "希伯来语",
  "he-IL": "希伯来语",
  "hi": "印地语",
  "hi-IN": "印地语",
  "hr": "克罗地亚语",
  "hr-BA": "克罗地亚语(波斯尼亚和黑塞哥维那)",
  "hr-HR": "克罗地亚语",
  "hu": "匈牙利语",
  "hu-HU": "匈牙利语",
  "hy": "亚美尼亚语",
  "hy-AM": "亚美尼亚语",
  "id": "印度尼西亚语",
  "id-ID": "印度尼西亚语",
  "is": "冰岛语",
  "is-IS": "冰岛语",
  "it": "意大利语",
  "it-CH": "意大利语(瑞士)",
  "it-IT": "意大利语(意大利)",
  "ja": "日语",
  "ja-JP": "日语",
  "ka": "格鲁吉亚语",
  "ka-GE": "格鲁吉亚语",
  "kk": "哈萨克语",
  "kk-KZ": "哈萨克语",
  "kn": "卡纳拉语",
  "kn-IN": "卡纳拉语",
  "ko": "朝鲜语",
  "ko-KR": "朝鲜语",
  "kok": "孔卡尼语",
  "kok-IN": "孔卡尼语",
  "ky": "吉尔吉斯语",
  "ky-KG": "吉尔吉斯语(西里尔文)",
  "lt": "立陶宛语",
  "lt-LT": "立陶宛语",
  "lv": "拉脱维亚语",
  "lv-LV": "拉脱维亚语",
  "mi": "毛利语",
  "mi-NZ": "毛利语",
  "mk": "马其顿语",
  "mk-MK": "马其顿语(FYROM)",
  "mn": "蒙古语",
  "mn-MN": "蒙古语(西里尔文)",
  "mr": "马拉地语",
  "mr-IN": "马拉地语",
  "ms": "马来语",
  "ms-BN": "马来语(文莱达鲁萨兰)",
  "ms-MY": "马来语(马来西亚)",
  "mt": "马耳他语",
  "mt-MT": "马耳他语",
  "nb": "挪威语(伯克梅尔)",
  "nb-NO": "挪威语(伯克梅尔)(挪威)",
  "nl": "荷兰语",
  "nl-BE": "荷兰语(比利时)",
  "nl-NL": "荷兰语(荷兰)",
  "nn-NO": "挪威语(尼诺斯克)(挪威)",
  "ns": "北梭托语",
  "ns-ZA": "北梭托语",
  "pa": "旁遮普语",
  "pa-IN": "旁遮普语",
  "pl": "波兰语",
  "pl-PL": "波兰语",
  "pt": "葡萄牙语",
  "pt-BR": "葡萄牙语(巴西)",
  "pt-PT": "葡萄牙语(葡萄牙)",
  "qu": "克丘亚语",
  "qu-BO": "克丘亚语(玻利维亚)",
  "qu-EC": "克丘亚语(厄瓜多尔)",
  "qu-PE": "克丘亚语(秘鲁)",
  "ro": "罗马尼亚语",
  "ro-RO": "罗马尼亚语",
  "ru": "俄语",
  "ru-RU": "俄语",
  "sa": "梵文",
  "sa-IN": "梵文",
  "se": "北萨摩斯语",
  "se-FI": "伊那里萨摩斯语(芬兰)",
  "se-NO": "南萨摩斯语(挪威)",
  "se-SE": "南萨摩斯语(瑞典)",
  "sk": "斯洛伐克语",
  "sk-SK": "斯洛伐克语",
  "sl": "斯洛文尼亚语",
  "sl-SI": "斯洛文尼亚语",
  "sq": "阿尔巴尼亚语",
  "sq-AL": "阿尔巴尼亚语",
  "sr-BA": "塞尔维亚语(西里尔文，波斯尼亚和黑塞哥维那)",
  "sr-SP": "塞尔维亚(西里尔文)",
  "sv": "瑞典语",
  "sv-FI": "瑞典语(芬兰)",
  "sv-SE": "瑞典语",
  "sw": "斯瓦希里语",
  "sw-KE": "斯瓦希里语",
  "syr": "叙利亚语",
  "syr-SY": "叙利亚语",
  "ta": "泰米尔语",
  "ta-IN": "泰米尔语(印度)",
  "ta-LK": "泰米尔语(斯里兰卡)",
  "te": "泰卢固语",
  "te-IN": "泰卢固语",
  "th": "泰语",
  "th-TH": "泰语",
  "tl": "塔加路语",
  "tl-PH": "塔加路语(菲律宾)",
  "tn": "茨瓦纳语",
  "tn-ZA": "茨瓦纳语",
  "tr": "土耳其语",
  "tr-TR": "土耳其语",
  "ts": "宗加语",
  "tt": "鞑靼语",
  "tt-RU": "鞑靼语",
  "uk": "乌克兰语",
  "uk-UA": "乌克兰语",
  "ur": "乌都语",
  "ur-PK": "乌都语",
  "uz": "乌兹别克语",
  "uz-UZ": "乌兹别克语(西里尔文)",
  "vi": "越南语",
  "vi-VN": "越南语",
  "xh": "班图语",
  "xh-ZA": "班图语",
  "zh": "中文",
  "zh-CN": "中文(中国-简体)",
  "zh-HK": "中文(中国-香港)",
  "zh-MO": "中文(中国-澳门)",
  "zh-SG": "中文(新加坡)",
  "zh-TW": "中文(中国-台湾)",
  "zu": "祖鲁语",
  "zu-ZA": "祖鲁语"
};
const local_en = {
  "af": "Afrikaans",
  "af-ZA": "Afrikaans (South Africa)",
  "ar": "Arabic",
  "ar-AE": "Arabic (U.A.E.)",
  "ar-BH": "Arabic (Bahrain)",
  "ar-DZ": "Arabic (Algeria)",
  "ar-EG": "Arabic (Egypt)",
  "ar-IQ": "Arabic (Iraq)",
  "ar-JO": "Arabic (Jordan)",
  "ar-KW": "Arabic (Kuwait)",
  "ar-LB": "Arabic (Lebanon)",
  "ar-LY": "Arabic (Libya)",
  "ar-MA": "Arabic (Morocco)",
  "ar-OM": "Arabic (Oman)",
  "ar-QA": "Arabic (Qatar)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "ar-SY": "Arabic (Syria)",
  "ar-TN": "Arabic (Tunisia)",
  "ar-YE": "Arabic (Yemen)",
  "az": "Azeri (Latin)",
  "az-AZ": "Azeri (Cyrillic) (Azerbaijan)",
  "be": "Belarusian",
  "be-BY": "Belarusian (Belarus)",
  "bg": "Bulgarian",
  "bg-BG": "Bulgarian (Bulgaria)",
  "bs-BA": "Bosnian (Bosnia and Herzegovina)",
  "ca": "Catalan",
  "ca-ES": "Catalan (Spain)",
  "cs": "Czech",
  "cs-CZ": "Czech (Czech Republic)",
  "cy": "Welsh",
  "cy-GB": "Welsh (United Kingdom)",
  "da": "Danish",
  "da-DK": "Danish (Denmark)",
  "de": "German",
  "de-AT": "German (Austria)",
  "de-CH": "German (Switzerland)",
  "de-DE": "German (Germany)",
  "de-LI": "German (Liechtenstein)",
  "de-LU": "German (Luxembourg)",
  "dv": "Divehi",
  "dv-MV": "Divehi (Maldives)",
  "el": "Greek",
  "el-GR": "Greek (Greece)",
  "en": "English",
  "en-AU": "English (Australia)",
  "en-BZ": "English (Belize)",
  "en-CA": "English (Canada)",
  "en-CB": "English (Caribbean)",
  "en-GB": "English (United Kingdom)",
  "en-IE": "English (Ireland)",
  "en-IN": "English (Indian)",
  "en-JM": "English (Jamaica)",
  "en-NZ": "English (New Zealand)",
  "en-PH": "English (Republic of the Philippines)",
  "en-TT": "English (Trinidad and Tobago)",
  "en-US": "English (United States)",
  "en-ZA": "English (South Africa)",
  "en-ZW": "English (Zimbabwe)",
  "eo": "Esperanto",
  "es": "Spanish",
  "es-AR": "Spanish (Argentina)",
  "es-BO": "Spanish (Bolivia)",
  "es-CL": "Spanish (Chile)",
  "es-CO": "Spanish (Colombia)",
  "es-CR": "Spanish (Costa Rica)",
  "es-DO": "Spanish (Dominican Republic)",
  "es-EC": "Spanish (Ecuador)",
  "es-ES": "Spanish (Spain)",
  "es-GT": "Spanish (Guatemala)",
  "es-HN": "Spanish (Honduras)",
  "es-MX": "Spanish (Mexico)",
  "es-NI": "Spanish (Nicaragua)",
  "es-PA": "Spanish (Panama)",
  "es-PE": "Spanish (Peru)",
  "es-PR": "Spanish (Puerto Rico)",
  "es-PY": "Spanish (Paraguay)",
  "es-SV": "Spanish (El Salvador)",
  "es-UY": "Spanish (Uruguay)",
  "es-VE": "Spanish (Venezuela)",
  "et": "Estonian",
  "et-EE": "Estonian (Estonia)",
  "eu": "Basque",
  "eu-ES": "Basque (Spain)",
  "fa": "Farsi",
  "fa-IR": "Farsi (Iran)",
  "fi": "Finnish",
  "fi-FI": "Finnish (Finland)",
  "fo": "Faroese",
  "fo-FO": "Faroese (Faroe Islands)",
  "fr": "French",
  "fr-BE": "French (Belgium)",
  "fr-CA": "French (Canada)",
  "fr-CH": "French (Switzerland)",
  "fr-FR": "French (France)",
  "fr-LU": "French (Luxembourg)",
  "fr-MC": "French (Principality of Monaco)",
  "gl": "Galician",
  "gl-ES": "Galician (Spain)",
  "gu": "Gujarati",
  "gu-IN": "Gujarati (India)",
  "he": "Hebrew",
  "he-IL": "Hebrew (Israel)",
  "hi": "Hindi",
  "hi-IN": "Hindi (India)",
  "hr": "Croatian",
  "hr-BA": "Croatian (Bosnia and Herzegovina)",
  "hr-HR": "Croatian (Croatia)",
  "hu": "Hungarian",
  "hu-HU": "Hungarian (Hungary)",
  "hy": "Armenian",
  "hy-AM": "Armenian (Armenia)",
  "id": "Indonesian",
  "id-ID": "Indonesian (Indonesia)",
  "is": "Icelandic",
  "is-IS": "Icelandic (Iceland)",
  "it": "Italian",
  "it-CH": "Italian (Switzerland)",
  "it-IT": "Italian (Italy)",
  "ja": "Japanese",
  "ja-JP": "Japanese (Japan)",
  "ka": "Georgian",
  "ka-GE": "Georgian (Georgia)",
  "kk": "Kazakh",
  "kk-KZ": "Kazakh (Kazakhstan)",
  "kn": "Kannada",
  "kn-IN": "Kannada (India)",
  "ko": "Korean",
  "ko-KR": "Korean (Korea)",
  "kok": "Konkani",
  "kok-IN": "Konkani (India)",
  "ky": "Kyrgyz",
  "ky-KG": "Kyrgyz (Kyrgyzstan)",
  "lt": "Lithuanian",
  "lt-LT": "Lithuanian (Lithuania)",
  "lv": "Latvian",
  "lv-LV": "Latvian (Latvia)",
  "mi": "Maori",
  "mi-NZ": "Maori (New Zealand)",
  "mk": "FYRO Macedonian",
  "mk-MK": "FYRO Macedonian (Former Yugoslav Republic of Macedonia)",
  "mn": "Mongolian",
  "mn-MN": "Mongolian (Mongolia)",
  "mr": "Marathi",
  "mr-IN": "Marathi (India)",
  "ms": "Malay",
  "ms-BN": "Malay (Brunei Darussalam)",
  "ms-MY": "Malay (Malaysia)",
  "mt": "Maltese",
  "mt-MT": "Maltese (Malta)",
  "nb": "Norwegian (Bokmål)",
  "nb-NO": "Norwegian (Bokmål) (Norway)",
  "nl": "Dutch",
  "nl-BE": "Dutch (Belgium)",
  "nl-NL": "Dutch (Netherlands)",
  "nn-NO": "Norwegian (Nynorsk) (Norway)",
  "ns": "Northern Sotho",
  "ns-ZA": "Northern Sotho (South Africa)",
  "pa": "Punjabi",
  "pa-IN": "Punjabi (India)",
  "pl": "Polish",
  "pl-PL": "Polish (Poland)",
  "pt": "Portuguese",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  "qu": "Quechua",
  "qu-BO": "Quechua (Bolivia)",
  "qu-EC": "Quechua (Ecuador)",
  "qu-PE": "Quechua (Peru)",
  "ro": "Romanian",
  "ro-RO": "Romanian (Romania)",
  "ru": "Russian",
  "ru-RU": "Russian (Russia)",
  "sa": "Sanskrit",
  "sa-IN": "Sanskrit (India)",
  "se": "Sami (Northern)",
  "se-FI": "Sami (Inari) (Finland)",
  "se-NO": "Sami (Southern) (Norway)",
  "se-SE": "Sami (Southern) (Sweden)",
  "sk": "Slovak",
  "sk-SK": "Slovak (Slovakia)",
  "sl": "Slovenian",
  "sl-SI": "Slovenian (Slovenia)",
  "sq": "Albanian",
  "sq-AL": "Albanian (Albania)",
  "sr-BA": "Serbian (Cyrillic) (Bosnia and Herzegovina)",
  "sr-SP": "Serbian (Cyrillic) (Serbia and Montenegro)",
  "sv": "Swedish",
  "sv-FI": "Swedish (Finland)",
  "sv-SE": "Swedish (Sweden)",
  "sw": "Swahili",
  "sw-KE": "Swahili (Kenya)",
  "syr": "Syriac",
  "syr-SY": "Syriac (Syria)",
  "ta": "Tamil",
  "ta-IN": "Tamil (India)",
  "ta-LK": "Tamil (Sri Lankan)",
  "te": "Telugu",
  "te-IN": "Telugu (India)",
  "th": "Thai",
  "th-TH": "Thai (Thailand)",
  "tl": "Tagalog",
  "tl-PH": "Tagalog (Philippines)",
  "tn": "Tswana",
  "tn-ZA": "Tswana (South Africa)",
  "tr": "Turkish",
  "tr-TR": "Turkish (Turkey)",
  "ts": "Tsonga",
  "tt": "Tatar",
  "tt-RU": "Tatar (Russia)",
  "uk": "Ukrainian",
  "uk-UA": "Ukrainian (Ukraine)",
  "ur": "Urdu",
  "ur-PK": "Urdu (Islamic Republic of Pakistan)",
  "uz": "Uzbek (Latin)",
  "uz-UZ": "Uzbek (Cyrillic) (Uzbekistan)",
  "vi": "Vietnamese",
  "vi-VN": "Vietnamese (Viet Nam)",
  "xh": "Xhosa",
  "xh-ZA": "Xhosa (South Africa)",
  "zh": "Chinese",
  "zh-CN": "Chinese (China-Mainland)",
  "zh-HK": "Chinese (China-Hong Kong)",
  "zh-MO": "Chinese (China-Macau)",
  "zh-SG": "Chinese (Singapore)",
  "zh-TW": "Chinese (China-Taiwan)",
  "zu": "Zulu",
  "zu-ZA": "Zulu (South Africa)"
};

        const $this = getCurrentInstance();
        const paths = props.path.split('/');
        const current_name = paths[paths.length-1];
        const path = paths.filter((c,i)=>i<paths.length-1).join('/');

        const projects = useProjects();
        const logger = useLogger();
        const state = reactive({
            keys:[],
            labels:navigator.language == defaultLanguage ? local_en : local_cn,
            key:current_name,
            content:{},
            loading:false,
            newValue:'',

            contents:{},
            changeds:{},
            showChangeTimer:0
        });

        const parseContent = (language,content)=>{
            const result = content
            .replace(/\r\n|\r/g, "\n").split('\n')
            .filter(c=>!!c).reduce((json,item,index)=>{
                if(item[0] == '['){
                    json['_key'] = item.trim().replace(/\[|\]/g,'');
                    json[json['_key']] = [];
                }else{
                    const _arr = item.split('=');
                    json[json['_key']].push({key:_arr[0].trim(),value:_arr[1].trim().replace(/^\"|\"$/g,'')});
                }
                return json;
            },{_key:'common',_editable:language == defaultLanguage});

            if(language == defaultLanguage && Object.keys(result).filter(c=>!c.includes('_')).length == 0){
                result['common'] = [{key:'displayName',value:''}];
                result['entry'] = [{key:'title',value:''}];
            }

            return result;
        }
        const synContent = (language)=>{
            if(language == defaultLanguage) return;

            const currentJson = state.content[language] || {};
            const result = JSON.parse(JSON.stringify(state.content[defaultLanguage]));

            for(let key in result){
                if(key.includes('_')){
                    result[key] = currentJson[key];
                    continue;
                }
                if(!currentJson[key]){
                    currentJson[key] = [];
                }
                for(let i = 0; i < result[key].length; i++){
                    const _key = result[key][i].key;
                    const currentItem = currentJson[key].filter(c=>c.key == _key)[0] || result[key][i];
                    result[key][i].value = currentItem.value;
                }
            }
            state.content[language] = result;
        }
        const handleItemChange = ()=>{
            for(let j in state.content){
                synContent(j);
                
            }
            for(let i = 0; i < state.keys.length; i++){
                state.changeds[state.keys[i]] = true;
            }
        }

        const loadFiles = ()=>{
            fetchFileList(path,1,1000).then((res)=>{
                const keys =[defaultLanguage].concat(res.list.map(c=>c.name).filter(c=>c != defaultLanguage));
                state.keys = keys;
                if(state.keys.includes(state.key) == false){
                    state.key = defaultLanguage;
                }
                handleChange(state.key);
            }).catch((e)=>{
                logger.value.error(`${e}`)
            })
        }
        const handleChange = (value)=>{
            return new Promise((resolve,reject)=>{
                if(state.content[value]){
                    synContent(value);
                    resolve();
                }
                else{
                    fetchFileRead(`${path}/${value}`).then((res)=>{
                        state.content[value] =  parseContent(value,res);
                        synContent(value);
                        state.contents[value] = unparseContent(state.content[value]);
                        resolve();
                    }).catch((e)=>{ console.log(e); })
                }
            })
        }
        const handleEdit = (_id,action) => {
            if(action == 'add'){

                const labels = Object.keys(state.labels).filter(c=>state.keys.includes(c)==false);
                state.newValue = labels[0];
                ElMessageBox({
                    title:'选择要添加的语言',
                    draggable:true,
                    message:()=>h(ElSelect,{
                        modelValue:state.newValue,
                        filterable:true,
                        style:{'width':'20rem'},
                        'onUpdate:modelValue': (val) => {
                            state.newValue = val
                        },
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                if (!state.newValue) {
                                    instance.message = '请选择一项'
                                    return
                                }
                                
                                done();
                                resolve(state.newValue);
                            }
                        }
                    },{
                        default: () => labels.map(item => 
                            h(ElOption, {
                                label: `${item}(${state.labels[item]})`,
                                value: item,
                                disabled:item.includes('-') == false
                            })
                        )
                    })
                }).then(()=>{
                    fetchFileCreate(`${path}/${state.newValue}`,true)
                    .then(()=>{
                        projects.value.load();
                        loadFiles();
                    }).catch(()=>{});
                }).catch(()=>{});
            }else if(action == 'remove'){
                if(_id == 'en-US') return;
                ElMessageBox.confirm('确定要删除该语言吗吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    draggable:true,
                    customStyle: {
                        'vertical-align':'unset'
                    },
                }).then(() => {
                    fetchFileDelete(`${path}/${_id}`,true)
                    .then(()=>{
                        projects.value.load();
                        loadFiles();
                    }).catch(()=>{});
                }).catch((e) => {
                    logger.value.error(`${e}`);
                });
            }
        }


        const unparseContent = (content)=>{
            const arr = [];
            for(let j in content){
                if(j.includes('_')){
                    continue;
                }
                arr.push(`[${j}]`);
                for(let i = 0; i < content[j].length; i++){
                    const item = content[j][i];
                    arr.push(`${item.key}="${item.value.trim()}"`);
                }
                arr.push('');
            }
            return arr.join('\n');
        }
        const getContent = ()=>{
            return new Promise((resolve,reject)=>{ 
                try{
                    resolve({
                        path:`${path}/${state.key}`,
                        content:unparseContent(state.content[state.key]),
                        changed_key:state.key,
                        changed:Object.values(state.changeds).some(c=>c)
                    })
                }catch(e){
                    reject(e);
                }
            });
        }
        const setChangedContent = (type,content)=>{
            state.contents[type] = content;
        }
        const saveBtnTimer = ()=>{
            clearTimeout(state.showChangeTimer);
            state.showChangeTimer = setTimeout(()=>{
                for(let j in state.content){
                    const content = unparseContent(state.content[j]);
                    state.changeds[j] = content != state.contents[j];
                }
                saveBtnTimer();
            },500);
        }
        onUnmounted(()=>{
            clearTimeout(state.showChangeTimer);
        });

        onMounted(()=>{
            saveBtnTimer();
            handleChange(defaultLanguage).then(()=>{
                loadFiles();
            })
        })

        return {state,defaultLanguage,handleEdit,handleChange,handleItemChange,getContent,setChangedContent}
    }
}
</script>

<style lang="stylus" scoped>
.ui-tab{
    box-sizing: border-box;
}
</style>