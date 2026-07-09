import { inject, provide, ref, watch } from "vue";
import { useLogger } from "../logger";
import { fetchFileList } from "@/api/api";
import { t, tm } from "@/i18n";

const documents = [
    {match:/^manifest$/,url:'https://developer.fnnas.com/docs/core-concepts/manifest'},
    {match:/app\/docker/,url:'https://developer.fnnas.com/docs/core-concepts/docker'},
    {match:/app\/ui/,url:'https://developer.fnnas.com/docs/core-concepts/app-entry'},
    {match:/cmd/,url:'https://developer.fnnas.com/docs/core-concepts/native#%E7%BC%96%E8%BE%91%E5%BA%94%E7%94%A8%E5%90%AF%E5%81%9C%E8%84%9A%E6%9C%AC'},
    {match:/config\/privilege/,url:'https://developer.fnnas.com/docs/core-concepts/privilege'},
    {match:/config\/resource/,url:'https://developer.fnnas.com/docs/core-concepts/resource'},
    {match:/config/,url:'https://developer.fnnas.com/docs/core-concepts/resource'},
    {match:/wizard/,url:'https://developer.fnnas.com/docs/core-concepts/wizard'},
    {match:/(ICON|icon).*(PNG|png)$/,url:'https://developer.fnnas.com/docs/core-concepts/icon'},
]

const sizeFormat = (size) => {
    if(size < 1024){
        return `${size}B`;
    }
    if(size < 1024*1024){
        return `${(size/1024).toFixed(2)}KB`;
    }
    if(size < 1024*1024*1024){
        return `${(size/(1024*1024)).toFixed(2)}MB`;
    }
    return `${(size/(1024*1024*1024)).toFixed(2)}GB`;
}

const projectsSymbol = Symbol();
export const provideProjects = () => {

    const logger = useLogger();
    const projects = ref({
        page:{
            loading:false,
            path:localStorage.getItem('projects_path') || './',
            root:'',
            name:'',
            p:1,
            ps:20,
            count:0,
            list:[]
        },
        editor:{
            path:'',
            root:'',
            remark:'',

            show:false,
            loading:false,
            width:600,
            height:'',

            guide:false,
            source:false,
            create:false,
            upload:false,
            mime:'*/*',
            paint:false,
            fnpacking:false
        },


        contextMenu:{
            show:false,
            x:0,
            y:0,
            row:null,
            cell:null
        },

        load(){
            this.page.loading = true;

            if(this.page.path == '.' || !this.page.path){
                this.page.path = './'
                return;
            }
            if(this.page.path.indexOf('//')>=0){
                this.page.path = this.page.path.replace(/\/\//g,'/');
                return;
            }
            
            const arr = this.page.path.split('/');
            this.page.root = arr.length > 1 ? arr.filter((c,i)=>i<=1) : '';
            this.page.name = arr[1] || '';

            localStorage.setItem('projects_path', this.page.path);
            fetchFileList(this.page.path,this.page.p,this.page.ps)
            .then(json=>{

                if(json.count === -1 && this.page.path !== './'){
                    this.page.path = this.page.path.substring(0,this.page.path.lastIndexOf('/'));
                    return;
                }

                this.page.loading = false;
                this.page.p = json.p;
                this.page.ps = json.ps;
                this.page.count = json.count;
                json.list.forEach(c=>{
                    const paths = `${this.page.path}/${c.name}`.split('/').filter(c=>c);
                    c.remark = paths.filter((item,index)=>index>1).join('/');
                    c.doc = (documents.filter(d=>d.match.test(c.remark))[0] || {url:''}).url;
                    c.remark = tm('project.remarks')[c.remark] || c.remark;
                    c.size = c.if ? sizeFormat(c.size) : '';
                })
                this.page.list = json.list;
                logger.value.success(t('project.loadSuccess', { path: this.page.path, loaded: this.page.list.length, total: this.page.count }));
            }).catch((e)=>{
                logger.value.error(t('project.loadFailed', { error: `${e}` }));
                this.page.loading = false;
            });
        }
    });
    watch(()=>projects.value.page.path, ()=>{
        projects.value.load();
    });

    provide(projectsSymbol, projects);
    return {
        projects
    }
}
export const useProjects = () => {
    return inject(projectsSymbol);
}
