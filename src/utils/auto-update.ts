
import { ElMessageBox } from 'element-plus'

// 上一次获取到的script地址
let initScriptSrcList: string[] = [];

const scriptReg = /<script.*src=["'](?<src>[^"']+)/gm;

const extractNewScripts = async () => {
    const param = Date.now()
    const html = await fetch('/?_time=' + param).then((resp) => resp.text());
    scriptReg.lastIndex = 0;
    let result = [];
    let match: RegExpExecArray
    while ((match = scriptReg.exec(html) as RegExpExecArray)) {
        result.push(match.groups?.src)
    }
    return result;
}

const isUpdate = async () => {
    const newScripts: any = await extractNewScripts();
    if (!initScriptSrcList.length) {
        initScriptSrcList = newScripts;
        return false;
    }
    let res = false;
    if (initScriptSrcList.length !== newScripts.length) {
        res = true;
    }
    for (let i = 0; i < initScriptSrcList.length; i++) {
        if (initScriptSrcList[i] !== newScripts[i]) {
            res = true;
            break
        }
    }
    initScriptSrcList = newScripts;
    return res;
}
const DELAY_TIME = 5000;
console.log('自动刷新功能已启动，每5秒检测一次页面内容更新');
export const autoRefresh = () => {
    setTimeout(async () => {
        const needUpdate = await isUpdate();
        if (needUpdate) {
            console.log('检测到页面有内容更新，自动刷新');
            ElMessageBox.confirm('检测到页面有内容更新，是否立即刷新？', '更新提示', {
                confirmButtonText: '确认',
                showCancelButton: false,
                type: 'warning'
            }).then(() => {
                location.reload();
            })
        }
        autoRefresh();
    }, DELAY_TIME)
}