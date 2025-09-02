export const ConfigData = {
  options: [
    { label: '新增分类', type: 'add' },
    { label: '新增其他类', type: 'other' },
    { label: '弹窗高亮node', type: 'dialog', isDialog: true },
    { label: '置顶', type: 'toTop' },
    { label: '置低', type: 'toBot', class: 'disabled' },
    { label: '删除', type: 'del' },
  ],
};

/** 根据节点获取节点路径 */
export function getIdPathByNode(node: any, key: string): string[] {
  if (node && node.level >= 1) {
    return [...getIdPathByNode(node?.parent, key), node.data[key]];
  }
  return [];
}

/** 文本复制 */
export function copyTextToClipBoard(text: string): Promise<any> {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = '-10em';
  textArea.style.left = '-10em';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  let result;
  try {
    const successful = document.execCommand('copy');
    result = successful ? Promise.resolve() : Promise.reject(new Error('exec copy failed'));
    console.log('复制成功：', text);
  } catch (err) {
    result = Promise.reject(err);
    console.error('复制失败：', text);
  }
  document.body.removeChild(textArea);

  return result;
}
// 初始化静态树数据
export function initTreeData(num: any = 5, level: any = 5, preLevel = 0, pIndex = 0) {
  const tagNum = Number(num) || 5;
  const tagLevel = Number(level);
  let treeId = 0;
  let i = preLevel;
  while (i > 0) {
    treeId += num ** i;
    i--;
  }
  treeId += pIndex * num;
  if (tagLevel > 0) {
    const list: any[] = (Array.from({ length: tagNum })).fill(1).map((el, index) => {
      return {
        label: `节点_${treeId + index}`,
        id: `${treeId + index}`,
        nodeId: `${treeId + index}`,
        nodeName: `节点_${treeId + index}`,
        nodeType: index % 2 === 0 ? 1 : 2,
        children: initTreeData(tagNum, tagLevel - 1, preLevel + 1, pIndex * num + index),
      };
    });
    return list;
  }
  return [];
}
// 随机定位数组
export function randomArr(lazy: boolean, nodeNum: any, nodeLevel: any) {
  const tagNum = Number(nodeNum) || 3;
  const tagLevel = Number(nodeLevel || 5);
  const list = [];
  let i = 0;
  if (lazy) {
    while (list.length < Number(tagLevel)) {
      const randomNum = Math.floor(Math.random() * tagNum) + i * tagNum;
      list.push(randomNum);
      i++;
    }
  } else {
    let i = tagLevel;
    let maxIndex = 0;
    while (i > 0) {
      maxIndex += tagNum ** i;
      i--;
    }
    console.log('-----maxIndex', maxIndex);
    list.push(Math.floor(Math.random() * maxIndex));
  }
  return list;
}
