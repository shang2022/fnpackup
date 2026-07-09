<template>
    <el-dialog v-model="state.show" :title="$t('editor.compiling')" width="50%"
     top="1vh" 
    :close-on-click-modal="false" :close-on-press-escape="false"  draggable class="terminal-dialog">
        <template v-if="state.show">
            <div ref="terminalRef" class="h-100"></div>
        </template>
    </el-dialog>
</template>

<script>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Terminal } from '@xterm/xterm'
import { FitAddon } from 'xterm-addon-fit'
import '@xterm/xterm/css/xterm.css'
import { t } from '@/i18n';
export default {
    setup () {
        
        const state = reactive({
            show:true
        });
        const terminalRef = ref(null);
        const fitAddon = new FitAddon();
        const terminal = new Terminal({
            cursorBlink: false,
            disableStdin: true,
            allowTransparency: true,
            scrollback:false
        });
        

        onMounted(() => {
            nextTick(()=>{
                terminal.loadAddon(fitAddon);
                terminal.open(terminalRef.value);
                fitAddon.fit();
                terminal.write(Array(16).fill(t('editor.compilingText')).join(''))
            });
        })

        return {state,terminalRef}
    }
}
</script>

<style lang="stylus">
.el-overlay-dialog{
    overflow: hidden !important;
}
.terminal-dialog{
    max-width: 80%;
    height:90%;
    .el-dialog__body {
        height: calc(100% - 4rem);
    }
}
</style>
<style lang="stylus" scoped>

</style>
