(function ($) {
    /*
    其中参数说明：
    isExcelHeader处理是否需要加上类似excel一样的表头
    isLoadExcel 用来判断是否加载excel文件内容,如果为false则假在DataTable数据格式
    style在isLoadExcel为false时有效，用来指定DataTable中的列在页面上对齐方式
    */
    var defaults = {
        isExcelHeader: true,//处理是否需要加上类似excel一样的表头
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        scrollX: true,
        autoWidth: false,
        style: null,
        isLoadExcel: true
    }
    var configArgs = {
        columns: null,
        data: null,
        mergeCells: null,
        cellStyles: null
    }
 
    $.fn.extend({
        loadDataToTable: function (jsonStr) {
            var json = jsonStr;
            if (typeof jsonStr === "object") {//判断是否为对象，如果为对象直接覆盖默认值
                $.extend(true, defaults, jsonStr)
                json = jsonStr.data;
            }
 
            if (defaults.isLoadExcel) {
                return initTable4Excel(json, defaults, $(this));
            } else {
                return initTable(json, defaults, $(this));
            }
        }
    });
 
    /**
    *加载c#中为datatable的数据格式
    */
    function initTable(json, defaults, $table) {
        var jsonStr = json;
        if (typeof jsonStr === "object") {//判断是否为对象，如果为对象直接覆盖默认值
            $.extend(true, defaults, jsonStr)
            jsonStr = json.data;
        }
        if (jsonStr == null || jsonStr == "") {
            alert("数据为空！");
            return;
        }
        var json = JSON.parse(jsonStr);
        var coloumDef = Object.keys(json[0]);//获取DataTable中表头数据
        var data = [];
        var column = [];
        if (!defaults.isExcelHeader) {
            for (var i = 0; i < json.length; i++) {
                data[i] = [];
                for (var j = 0; j < coloumDef.length; j++) {
                    data[i][j] = json[i][coloumDef[j]];
                }
            }
            for (var i = 0; i < coloumDef.length; i++) {
                column[i] = { title: coloumDef[i] };
            }
        } else {
            for (var r = 0; r <= json.length; r++) {
                data[r] = [];
                for (var c = 0; c < coloumDef.length; c++) {
                    if (r == 0) {
                        column[c+1] = { title: numToExcelHeader(c) }
                        data[r][c+1] = coloumDef[c];
                    } else {
                        data[r][c+1] = json[r - 1][coloumDef[c]];
 
                    }
                    if (c == 0) {
                        data[r][0] = r + 1;
                        column[c] = { title: "" };
                    }
                }
            }
        }
 
        var $parent = $($table).parent();
        if (column.length < 4) {//通过列的数量控制宽度占比
            $($parent).attr("style", "width:60% !important;");
        } else {
            $($parent).attr("style", "width:100% !important;");
        }
        //对于DataTable的数据无需隐藏Th，因此需要移除父元素的hiddenTh类
        $($parent).removeClass("hiddenTh");
 
 
        return $table.dataTable({
            paging: defaults.paging,
            searching: defaults.searching,
            ordering: defaults.ordering,
            info: defaults.info,
            scrollX: defaults.scrollX,
            autoWidth: defaults.autoWidth,
            data: data,
            columns: column,
            columnDefs: [{
                targets: '_all',
                createdCell: function (td, cellData, rowData, row, col) {
                    if (row == 0 && defaults.isExcelHeader) {
                        //$(td).attr('style', "text-align:center;font-weight:bold;")
                        return;
                    }
                    if (defaults.style != null) {
                        var tdStyle = getConfigStyle(defaults.style[col]);
                        $(td).attr('style', tdStyle);
                    }
                }
            }
            ]
        }).api();
    }
 
 
    /**
     *加载excel内容
     */
    function initTable4Excel(json, defaults, $table) {
        var jsonStr = json;
        if (typeof jsonStr === "object") {//判断是否为对象，如果为对象直接覆盖默认值
            $.extend(true, defaults, jsonStr)
            jsonStr = json.data;
        }
        if (jsonStr == null || jsonStr == "") {
            alert("数据为空！");
            return;
        }
        prepareData(jsonStr, defaults.isExcelHeader);
 
        var $parent = $($table).parent();
 
        if (configArgs.columns.length < 4) {
            $($parent).attr("style", "width:60% !important;");
        } else {
            $($parent).attr("style", "width:100% !important;");
        }
        if (defaults.isExcelHeader) {
            $($parent).removeClass("hiddenTh");
        } else {
            $($parent).addClass("hiddenTh");
        }
 
        return $table.dataTable({
            paging: defaults.paging,
            searching: defaults.searching,
            ordering: defaults.ordering,
            info: defaults.info,
            scrollX: defaults.scrollX,
            autoWidth: defaults.autoWidth,
            data: configArgs.data,
            columns: configArgs.columns,
            columnDefs: [{
                targets: '_all',
                createdCell: function (td, cellData, rowData, row, col) {
                    if (defaults.isHeader && col == 0) {
                        return;
                    }
                    var mi = configArgs.mergeCells[row + '_' + col];
                    if (mi != null) {
                        if (mi.rowspan == 0 || mi.colspan == 0) {
                            $(td).remove();
                            return;
                        }
                        if (mi.rowspan > 1) {
                            $(td).attr('rowspan', mi.rowspan)
                        }
                        if (mi.colspan > 1) {
                            $(td).attr('colspan', mi.colspan)
                        }
                    }
                    var cStyle = configArgs.cellStyles[row][col];
                    if (cStyle != null) {
                        $(td).attr('style', cStyle)
                    }
                }
            }
            ]
        }).api();
    }
 
    function prepareData(jsonStr, isHeader) {
        configArgs.columns = [], configArgs.data = [], configArgs.mergeCells = {}, configArgs.cellStyles = [];
        var rows = JSON.parse(jsonStr);
        for (var r = 0; r < rows.length; r++) {
            var cells = rows[r];
            for (var c = 0; c < cells.length; c++) {
                if (r == 0) {
                    if (!isHeader) {
                        configArgs.columns[c] = { title: numToExcelHeader(c) };
                    } else {
                        configArgs.columns[c+1] = { title: numToExcelHeader(c) };
                    }
                    
                }
                if (c == 0) {
                    configArgs.data[r] = [];
                    if (isHeader) {
                        configArgs.data[r][0] = r + 1;
                        configArgs.columns[c] = { title: "" };
                    }
                    configArgs.cellStyles[r] = [];
                }
                if (isHeader) {
                    configArgs.data[r][c+1] = cells[c].Value;
                    if (cells[c].IsMergeCell) {
                        if (cells[c].MergeInfo != null) {
                            configArgs.mergeCells[r + '_' + (c+1)] = cells[c].MergeInfo;
                        } else {
                            configArgs.mergeCells[r + '_' + (c+1)] = { rowspan: 0, colspan: 0 };
                        }
                    }
                    configArgs.cellStyles[r][c+1] = getStyle(cells[c]);
                } else {
                    configArgs.data[r][c] = cells[c].Value;
                    if (cells[c].IsMergeCell) {
                        if (cells[c].MergeInfo != null) {
                            configArgs.mergeCells[r + '_' + c] = cells[c].MergeInfo;
                        } else {
                            configArgs.mergeCells[r + '_' + c] = { rowspan: 0, colspan: 0 };
                        }
                    }
                    configArgs.cellStyles[r][c] = getStyle(cells[c]);
                }
                
            }
        }
    }
 
    function getStyle(cell) {
        var style = null;
        if (cell.HorizontalAlign == 'Center') {
            style = 'text-align:center;';
        } else if (cell.HorizontalAlign == 'Right') {
            style = 'text-align:right;';
        }
 
        return style;
    }
})(jQuery);
 
 
function getConfigStyle(style) {
    if (style == "right") {
        return 'text-align:right;';
    } else if (style == "center") {
        return 'text-align:center;';
    } else {
        return 'text-align:left;';
    }
}
 
(function () {
    if (!Object.keys) Object.keys = function (o) {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k = [], p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p))
            k.push(p);
        return k;
    }
 
})()
 
function isNumber(value) {         //验证是否为数字
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
 
 
function numToExcelHeader(col) {
    var ordA = 'A'.charCodeAt(0);
    var len = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    var s = '', c = col;
    while (c >= 0) {
        s = String.fromCharCode(c % len + ordA) + s;
        c = Math.floor(c / len) - 1;
    }
    return s;
}