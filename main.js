//特殊elementデータ取得部


function aboutThatButton(num) {
    this.getColor = function () {
        color_kind = Object.keys(new textOfBlockAndButton())
        for (let i = 0; i <= color_kind.length; i++) {
            if (num <= new numberOccupiedByColor()["until_" + color_kind[i]]) {
                return color_kind[i];
            }
        }
    }
    this.getNumberInColor = function () {
        color_kind = Object.keys(new textOfBlockAndButton())
        let result
        for (let i = 0; i < color_kind.length; i++) {
            if (num <= new numberOccupiedByColor()["until_" + color_kind[i]]) {
                if (i > 0) {
                    result = num - new numberOccupiedByColor()["until_" + color_kind[i - 1]]
                    return result - 1
                }
                else {
                    return num
                }
            }
        }
    }
}

//element操作

function selectElement() {
    this.allQuerySelect = function (data) {
        let argument = data;
        const element = document.querySelectorAll(argument);
        return element;
    }
    this.selectById = function (data) {
        let argument = data;
        if (argument.startsWith("#")) {
            argument = argument.substring(1);
            const element = document.getElementById(argument);
            return element;
        }
        else {
            const element = document.getElementById(argument);
            return element;
        }
    }
}

function operateElement() {
    this.push = function (node, path) {
        return path.appendChild(node);
    }
    this.getPath = function (path) {
        if (path.startsWith("../")) {
            console.error("documentがデフォルトであり、一個前の階層に戻ることはできません。")
            return;
        }
        else if (path.startsWith("./")) {
            path = path.substring(1);
        }
        else if (path.startsWith("/")) {
            path = path.substring(0);
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        const splited_path = path.split('/');
        let actual_path = document;
        for (let i = 0; i < splited_path.length; i++) {
            if (actual_path.querySelector(splited_path[i]) == null) {
                document.getElementById(splited_path[i]);
            }
            else {
                actual_path = actual_path.querySelector(splited_path[i]);
            }
        }
        return actual_path;
    }
    this.create = function (data) {
        let new_node;
        let node_data = data;
        let path;
        const attribute_template = Object.keys(new dataForCreateElement())
        if (node_data.type != "") {
            new_node = document.createElement(node_data.type)
        }
        else {
            console.error("タグが指定されていません！");
            return;
        }
        for (let i = 0; i < attribute_template.length; i++) {
            if (node_data[attribute_template[i]] != "" && attribute_template[i] != "to_push_before" && attribute_template[i] != "type") {
                switch (attribute_template[i]) {
                    case "path":
                        path = this.getPath(node_data.path);
                        break;
                    case "to_push_before":
                        console.error("to_push_beforeが不適切な場所で参照されています。");
                        return;
                    default:
                        switch (attribute_template[i]) {
                            case "id":
                                if (node_data[attribute_template[i]].startsWith("#")) {
                                    node_data[attribute_template[i]] = node_data[attribute_template[i]].substring(1)
                                }
                                break;
                            case "class":
                                if (node_data[attribute_template[i]].startsWith(".")) {
                                    node_data[attribute_template[i]] = node_data[attribute_template[i]].substring(1)
                                }
                                break;
                        }
                        new_node[attribute_template[i]] = node_data[attribute_template[i]];
                        break;
                }
            }
        }
        return this.push(new_node, path);
    }
    this.delete = function (path) {
        let element = this.getPath(path)
        element.remove()

    }
}
function dragAndDrop() {
    this.refresh = function () {
        const all_box = new selectElement().allQuerySelect(".box");
        const all_block = new selectElement().allQuerySelect(".block");
        const not_used_canvas = document.getElementById("not_used");
        not_used_canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        })
        not_used_canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            let dragged_element_id = e.dataTransfer.getData('text/plain');
            let dragged_element = document.getElementById(dragged_element_id);
                not_used_canvas.appendChild(dragged_element)
        });
        all_box.forEach((element) => {
            element.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            element.addEventListener('drop', (e) => {
                e.preventDefault();
                let dragged_element_id = e.dataTransfer.getData('text/plain');
                let dragged_element = document.getElementById(dragged_element_id);
                if (!element.hasChildNodes() || dragged_element.classList[2] == "black") {
                    if (element.classList[2] == dragged_element.classList[2]) {
                        element.appendChild(dragged_element)
                    }
                }
            });
        })
        all_block.forEach((element) => {
            let color = element.classList[0]
            const this_color_block = new selectElement().allQuerySelect(color);
            element.addEventListener('dragstart', (e) => {
                this_color_block.forEach(drop_zone_element =>
                    drop_zone_element.classList.add('active'));
                e.dataTransfer.setData('text/plain', e.target.id
                );
            });
            element.addEventListener('dragend', () => {
                this_color_block.forEach(drop_zone_element => drop_zone_element.classList.remove('active'));
            });
        })
    }
}


//データのカウント部

function numberOccupiedByColor() //ボタンの色の占有する番号
{
    const text_of_block_and_button = new textOfBlockAndButton;
    const color_list = Object.keys(text_of_block_and_button);
    let num_of_all_button = -1;
    for (let i = 0; i < color_list.length; i++) {
        this[color_list[i]] = text_of_block_and_button[color_list[i]].length;
        num_of_all_button += text_of_block_and_button[color_list[i]].length;
        this["until_" + color_list[i]] = num_of_all_button
    }
    this.all = num_of_all_button;
}

//初期実行部//

function buttonCreate() {
    for (let i = 0; i <= new numberOccupiedByColor().all; i++) {
        new operateElement().create(new dataForButton(i))
    }
}
class operateBlock {
    #id = "";
    #deleted_element = []
    setCandidate(data) {
        console.log(data);
        this.#id = data.id;
    }
    move_up() {
        const element = document.getElementById(this.#id);
        element.parentElement.insertBefore(element, element.previousElementSibling)

    }
    move_down() {
        const element = document.getElementById(this.#id);
        element.parentElement.insertBefore(element, element.nextSibling.nextSibling)
    }
}


console.log(new aboutThatButton(3).getNumberInColor() + ":" + new aboutThatButton(3).getColor())
addEventListener("load", () => {
    id = ["move_up", "move_down"];
    const thisOperateBlock = new operateBlock;
    for (let i = 0; i < id.length; i++) {
        this_button = document.getElementById(id[i]);
        this_button.addEventListener("click", () => {
            switch(id[i])
            {
                case  "move_up":
                    thisOperateBlock.move_up()
                    break;
                case  "move_down":
                    thisOperateBlock.move_down()
                    break;
            }
        }
        )
    }
    buttonCreate();
    const selectButton = new selectElement()
    const add_block_buttons = selectButton.allQuerySelect(".add_block_button")
    add_block_buttons.forEach((element) =>
        element.addEventListener("click", () => {
            const new_element = new operateElement().create(new dataForBlock(element.id))
            new_element.addEventListener("click", () => {
                thisOperateBlock.setCandidate(new_element);
                
            })
            new dragAndDrop().refresh();
        })
    );

});



//データ作成部

function dataForBlock(num) {
    dataForCreateElement.call(this)
    this.type = "div";
    this.path = "body/#canvas";
    this.draggable = true;
    aboutThatButton.call(this, num)
    console.log(num)
    this.id = "#" + new Date().getTime();
    if (this.getColor(num) == "purple" || this.getColor(num) == "aqua") {
        this.className = "black_block block black"
    }
    else {
        this.className = this.getColor(num) + "_block block " + this.getColor(num);
    }
    this.innerHTML = new textOfBlockAndButton()[this.getColor()][this.getNumberInColor()].block
}
function dataForButton(num) {
    dataForCreateElement.call(this)
    this.type = "button";

    this.path = "body/#place_of_button/#button_row" + Math.floor(num / 16);

    aboutThatButton.call(this, num)
    this.className = `button_${this.getColor(num)} add_block_button`;
    this.id = String(num)
    this.innerHTML = new textOfBlockAndButton()[this.getColor()][this.getNumberInColor()].button


}
function dataForCreateElement() {
    this.type = "";
    this.id = "";
    this.className = "";
    this.innerHTML = "";
    this.path = "";
    this.to_push_before = "";
    this.draggable = "";
}

//データ部

function textOfBlockAndButton() {
    const box_color_list = ["blue", "green", "red", "yellow", "black"];
    const br = "<br>"
    const text = "<input type='text' placeholder='0' class='text_box'>"
    let box = {}
    for (let i = 0; i < box_color_list.length; i++) {
        switch (box_color_list[i]) {
            case "black":
                box[box_color_list[i]] = `<span class='${box_color_list[i]}_box box ${box_color_list[i]}'></span>`
                break;
            default:
                box[box_color_list[i]] = `<span class='${box_color_list[i]}_box box ${box_color_list[i]}'></span>`
                break;
        }
    }
    this.purple = [
        {
            button: `if文  「もし」の文`,
            block: `もし${box.green}なら${br}${box.black}を実行する`
        },
        {
            button: `for文  「繰り返し」の文`,
            block: `最初だけ${box.red}を実行。${br}${box.green}${br}を満たす時だけ繰り返して、毎回${br}${box.black}と${box.red}を実行する`
        }
    ]
    this.aqua = [
        {
            button: `プレイヤーの移動の文`,
            block: `プレイヤーを${box.blue}歩進ませる`
        },
        {
            button: `赤色実行の文`,
            block: `${box.red}を実行する`
        }
    ]
    this.red = [
        {
            button: `代入文 ×に○を代入する`,
            block: `${box.blue}は${box.blue}`
        },
        {
            button: `代入文(加算)  「×」に「○」 + 「▲」を代入する`,
            block: `${box.blue}+${box.blue}が${box.blue}`
        },
        {
            button: `代入文(減算)  「×」に「○」 - 「▲」を代入する`,
            block: `${box.blue}-${box.blue}が${box.blue}`
        },
        {
            button: `代入文(乗算)  「×」に「○」 x 「▲」を代入する`,
            block: `${box.blue}×${box.blue}が${box.blue}`
        },
        {
            button: `代入文(徐算)  「×」に「○」 ÷ 「▲」を代入する`,
            block: `${box.blue}÷${box.blue}が${box.blue}`
        },
        {
            button: `代入文(二次元配列)  「×」に[○,▲]を代入する`,
            block: `${box.blue}は[${box.blue},${box.blue}]`
        }
    ]
    this.green = [
        {
            button: `比較演算(同数) 「×」が[○]である/でない`,
            block: `${box.blue}が${box.blue}${box.yellow}`
        },
        {
            button: `比較演算(以上) 「×」が[○]以上である/でない`,
            block: `${box.blue}が${box.blue}以上${box.yellow}`
        },
        {
            button: `比較演算(超過) 「×」が[○]超過である/でない`,
            block: `${box.blue}が${box.blue}超過${box.yellow}`
        },
        {
            button: `比較演算(以下) 「×」が[○]以下である/でない`,
            block: `${box.blue}が${box.blue}以下${box.yellow}`
        },
        {
            button: `比較演算(未満) 「×」が[○]未満である/でない`,
            block: `${box.blue}が${box.blue}未満${box.yellow}`
        },
        {
            button: `[x]のマスは落とし穴である/でない`,
            block: `${box.blue}は落とし穴${box.yellow}`
        }
    ]
    this.blue = [
        {
            button: `変数:❤️`,
            block: `❤️`
        },
        {
            button: `変数:⭐️`,
            block: `⭐️`
        },
        {
            button: `変数:😺`,
            block: `😺`
        },
        {
            button: `変数:🐶`,
            block: `🐶`
        },
        {
            button: `変数:🐰`,
            block: `🐰`
        },
        {
            button: `変数:🍵`,
            block: `🍵`
        },
        {
            button: `変数:🍊`,
            block: `🍊`
        },
        {
            button: `変数:🍎`,
            block: `🍎`
        },
        {
            button: `自由入力`,
            block: `${text}`
        }
    ]
    this.yellow = [
        {
            button: `である`,
            block: `である`
        },
        {
            button: `でない`,
            block: `でない`
        }
    ]
}