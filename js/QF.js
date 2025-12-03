
document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        const file_data = new Uint8Array(evt.target.result);
        // 3. 用 SheetJS 读取工作簿
        const workbook = XLSX.read(file_data, { type: 'array' });
        // 4. 默认取第一张工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // 5. 把整张表转成二维数组（每一格就是数组的一项）
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const solved_data = solveData(data);
        console.log(data);
        console.log(solved_data);
        // 6. 渲染成 HTML 表格
        renderTable_(solved_data);
      };
      reader.readAsArrayBuffer(file);
    }
    function solveData(data){
        var _QFs = {};
        var Q_num = 0;
        var rowNum = data.length - 1;
        var rowStart = 0;
        var colCode = 0;
        var colDesc = 0;
        var colQF = 0;
        var colNote = 0;
        var colPC = 0;
        var col08 = 0;
        var isFindCode = false;
        var isFindDesc = false;
        var isFindQF = false;
        var isFindNote = false;
        var isFindPC = false;
        var isFind08 = false;
        var res660 = "660:\n";
        var resSX = "\n石现:\n";
        var pc = [];
        var d ;d
        const regex = /^\d{4}\.\d{2}\.\d{2}$/;
        if(regex.test(data[0][0].split(" ")[0])){
        d = new Date(data[0][0].split(" ")[0].replaceAll(".", "/"));
        } else {
        d = new Date();
        }
        // console.log(d.toLocaleDateString() + d.toTimeString())
        pc.push(d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0'));
        d.setTime(d.getTime() - 24*60*60*1000);
        pc.push(d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0'));
        // console.log(pc);
        while(rowStart <= rowNum){
        if(data[rowStart].length >= 4){
            const row = data[rowStart];
            for(let i=0;i<row.length;++i){
            // console.log(i + ":" + typeof row[i] + ":" + row[i])
            if(row[i] == null || row[i] == undefined || (typeof row[i] != "string")) {continue;}
            if(!isFindCode && row[i].includes("物料编码")){
                colCode = i;
                isFindCode = true;
            } else if(!isFindDesc && row[i].includes("物料描述")){
                colDesc = i;
                isFindDesc = true;
            } else if(!isFindQF &&row[i].includes("欠发数量")){
                colQF = i;
                isFindQF = true;
            } else if(!isFindNote && row[i].includes("备注")){
                colNote = i;
                isFindNote = true;
            } else if(!isFindPC && row[i].includes("需要调拨批次")){
                colPC = i;
                isFindPC = true;
            } else if(!isFind08 && row[i].includes("需求调拨时间")){
                col08 = i;
                isFind08 = true;
            } 
            }
        }
        // if(rowStart <= 6){
        //   console.log(rowStart + "-2:" + isFindCode + isFindDesc + isFindQF + isFindNote + isFindPC + isFind08);
        // }
        if(isFindCode && isFindDesc && isFindQF && isFindNote && isFindPC && isFind08){
            break;
        }
        isFindCode = false;
        isFindDesc = false;
        isFindNote = false;
        isFindQF = false;
        isFindPC = false;
        isFind08 = false;
        rowStart += 1;
        }
        if(!(isFindCode && isFindDesc && isFindQF && isFindNote)){
            document.getElementById("result").innerHTML = "未找全物料编码、物料描述、欠发数量、备注、需要调拨批次、需求调拨时间</br>";
            return _QFs;
        }
        if(rowStart >= rowNum){
            document.getElementById("result").innerHTML = "空数据表</br>";
            return _QFs;
        }
        const mapCode2ShortName = new Map([
            [20102031,"有机780"],
            [20102043,"2入有机780"],
            [20101027, "1号店3入A2 450"],
            [20100256, "12入"],
            [20100737, "箱"],
            [20100736, "筐"],
            [20100389, "5连包"],
            [20100813, "娟姗fudi"],
            [20100925, "娟姗比优特"],
            [20100994, "娟姗合家福"],
            [20101014, "娟姗大润发"],
            [20101026, "娟姗联华"],
            [20102027, "圆瓶悦活里"],
            [20102086, "娟姗雅斯"],
            [20100718, "屋顶黑巧"],
            [20100461, "商超950"],
            [20100491, "叮咚950"],
            [20100640, "屋顶950"],
            [20100679, "A2 950"],
            [20100680, "有机950"],
            [20100700, "圆瓶950"],
            [20100717, "屋顶椰子"],
            [20100726, "朴朴圆瓶950"],
            [20100727, "屋顶明康汇"],
            [20100753, "餐饮950"],
            [20100820, "屋顶三江"],
            [20100937, "屋顶天虹"],
            [20100982, "屋顶华润"],
            [20101029, "屋顶永辉"],
            [20101030, "屋顶小象"],
            [20101031, "霸王茶姬950"],
            [20100922, "屋顶重百"],
            [20100978, "屋顶良食记"],
            [20100984, "圆瓶新佳宜"],
            [20100987, "屋顶罗森"],
            [20100988, "圆瓶盒马"],
            [20100939, "圆瓶小金金"],
            [20102021, "圆瓶钱大妈"],
            [20102036, "屋顶鸣鸣很忙"],
            [20100915, "屋顶430"],
            [20100630, "百利一斤鲜"],
            [20100954, "百利物美"],
            [20100492, "叮咚24入"],
            [20100269, "入户袋"],
            [20100556, "椰子试饮"],
            [20100673, "黑巧试饮"],
            [20100738, "喝鲜奶试饮"],
            [20100555, "百利椰子"],
            [20100672, "黑巧12入"],
            [20100390, "哞小鲜"],
            [20100201, "商超780"],
            [20100705, "朴朴780"],
            [20100934, "有机450"],
            [20102009, "3入有机450"],
            [20100202, "商超450"],
            [20100334, "3入450"],
            [20100440, "A2 450"],
            [20100599, "十足450"],
            [20102029, "3入A2 450"],
            [20100428, "商超260"],
            [20100694, "君乐宝A2 260"],
            [20100701, "有机260试饮"],
            [20100715, "有机260"],
            [20100840, "5入有机260"],
            [20100439, "A2 260"],
            [20100456, "5入260"],
            [20100457, "5入A2 260"],
            [20102049, "小象A2 260"],
            [20102163, "利乐峰950"]
        ]);




        let mapCode2QF = new Map();
        let mapCode2add = new Map();
        let mapCode2Desc = new Map();
        for(let i=rowStart+1;i<=rowNum;++i){
        const row = data[i];
        if(row.length >=colCode && !isNaN(row[colCode])){
            const code = parseInt(row[colCode]);
            const desc = row[colDesc];
            let QF = 0;
            if (row[colQF] == null) {
                QF = 0;
            } else {
                QF = parseInt(row[colQF]) || 0;
            }
            const note = row[colNote];
            if (!mapCode2Desc.has(code)) {
                mapCode2Desc.set(code, desc);
            }
            const Q_08 = row[col08].includes("0点近1")? "_0": "_8";
            if (QF !== 0) {
            if (note.includes("石现")) {
                if (mapCode2ShortName.has(code)) {
                    resSX += `${mapCode2ShortName.get(code)}: ${QF} \n`;
                    if(code in _QFs){
                        if("sx" in _QFs[code]){
                        _QFs[code]["sx"] += QF;
                        } else {
                        _QFs[code]["sx"] = QF;
                        }
                    } else {
                        _QFs[code] = {
                        code:code,
                        desc:mapCode2ShortName.get(code),
                        sx: QF
                        };
                    }
                } else {
                    resSX += `${desc}: ${QF} \n`;
                    if(code in _QFs){
                        if("sx" in _QFs[code]){
                        _QFs[code]["sx"] += QF;
                        } else {
                        _QFs[code]["sx"] = QF;
                        }
                    } else {
                        _QFs[code] = {
                        code:code,
                        desc:desc,
                        sx: QF
                        };
                    }
                }
            } else {
                if(isFindPC){
                var ipc = row[colPC].toString().replaceAll(" ","");
                if(pc.indexOf(ipc) < 0){
                    var tp = `${(ipc%10000/100).toFixed(2)}#`;
                    res660 += tp;
                    if (mapCode2ShortName.has(code)) {
                        res660 += `${mapCode2ShortName.get(code)}: ${QF} \n`;
                    } else {
                        res660 += `${desc}: ${QF} \n`;
                    }
                    _QFs[Q_num] = {
                    code:code,
                    desc: mapCode2ShortName.has(code)? tp + mapCode2ShortName.get(code) : tp + desc
                    }
                    _QFs[Q_num][Q_08] = QF;
                    Q_num += 1;
                    continue;
                } else {
                    if(!(code in _QFs)){
                    _QFs[code] = {
                        code:code,
                        desc: mapCode2ShortName.has(code)? mapCode2ShortName.get(code) : desc
                    }
                    }
                    if(Q_08 in _QFs[code]) {
                    _QFs[code][Q_08] += "+" + QF;
                    } else {
                    _QFs[code][Q_08] = QF;
                    }
                }
                } else {
                if(!(code in _QFs)){
                    _QFs[code] = {
                    code:code,
                    desc: mapCode2ShortName.has(code)? mapCode2ShortName.get(code) : desc
                    }
                }
                if(Q_08 in _QFs[code]) {
                    _QFs[code][Q_08] += "+" + QF;
                } else {
                    _QFs[code][Q_08] = QF;
                }
                }
                if (!mapCode2QF.has(code)) {
                    mapCode2QF.set(code, QF);
                    mapCode2add.set(code, QF.toString());
                } else {
                    mapCode2QF.set(code, mapCode2QF.get(code) + QF);
                    mapCode2add.set(code, mapCode2add.get(code) + "+" + QF.toString());
                }
            }
            }
        }
        }
        for (let [code, QF] of mapCode2QF) {
        if (mapCode2ShortName.has(code)) {
            res660 += `${mapCode2ShortName.get(code)}: `;
        } else {
            res660 += `${mapCode2Desc.get(code)}: `;
        }
        if (mapCode2add.get(code).includes("+")) {
            res660 += `${mapCode2add.get(code)}=${QF}\n`;
        } else {
            res660 += `${QF}\n`;
        }
        }
        const keys = Object.keys(_QFs); // 提取所有键
        const sortedKeys = keys.sort((a, b) => a - b); // 对键进行排序

        const sortedQFs = {};
        sortedKeys.forEach(key => {
            sortedQFs[key] = _QFs[key]; // 根据排序后的键重新构建对象
        });
        document.getElementById("result").innerHTML = (res660 + resSX + "\n\n\n\n\n").replaceAll("\n","</br>");
        return sortedQFs;
    }
function renderTable(arr) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // 清空旧内容

    const table = document.createElement('table');

    arr.forEach(rowArr => {
    const tr = document.createElement('tr');
    rowArr.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell ?? ''; // null/undefined 转空串
        tr.appendChild(td);
    });
    table.appendChild(tr);
    });

    container.appendChild(table);
}
function renderTable_(dict) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = ''; // 清空旧内容

    const table = document.createElement('div');
    table.className = 'table';
    const headerRow = document.createElement('div');
    headerRow.className = "head";
    [['物料',"th col-desc"], ['0点',"th col-0"], ['8点',"th col-8"], ['石现',"th col-sx"]].forEach(text => {
        const th = document.createElement('div');
        th.textContent = text[0];
        th.className = text[1];
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    Object.values(dict).forEach(item => {
        const tr = document.createElement('div');
        tr.className = "tr";

        // 物料
        const tdDesc = document.createElement('div');
        tdDesc.textContent = item.desc ?? '';
        tdDesc.className='td col-desc';
        tr.appendChild(tdDesc);

        // 0点
        const td0 = document.createElement('div');
        td0.textContent = item._0 ?? '';
        td0.className='td col-0';
        tr.appendChild(td0);

        // 8点
        const td8 = document.createElement('div');
        td8.textContent = item._8 ?? '';
        td8.className='td col-8';
        tr.appendChild(td8);

        // 石现
        const tdSx = document.createElement('div');
        tdSx.textContent = item.sx ?? '';
        tdSx.className='td col-sx';
        tr.appendChild(tdSx);

        table.appendChild(tr);
    });
    container.appendChild(table);
}