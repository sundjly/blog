var state = '';
$(function() {
    $('#btnSubmit').click(function() {
        state = 'fbz';
        SaveGetAjax(state);
    });
    getCity();
    getName();
    $("#btnCancel").click(function() {
        state = 'wfz';
        SaveGetAjax(state);
    });
});

function getCity() {
    var url = 'http://172.20.76.90:8181/Health/app/dsSysArea/queryList';
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        async: false,
        data: {},
        success: function(data) {
            var response = data.response;
            if (response) {
                var data = data.data;
                var option = '<option value="">-请选择-</option>';
                for (var i = 0; i < data.length; i++) {
                    option += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                }
                $('#city').empty().append(option);
            } else {}
        },
        error: function(data) { alert('ajax传输失败'); }
    })
}

//获取项目类型
function getName() {
    var url = 'http://172.20.76.90:8181/Health/app/dsServiceCategory/queryList';
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        async: false,
        data: {},
        success: function(data) {
            var response = data.response;
            if (response) {
                var data = data.data;
                var option = '<option value="">-请选择-</option>';
                for (var i = 0; i < data.length; i++) {
                    option += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                }
                $('#categoryName').empty().append(option);
            } else {}
        },
        error: function(data) { alert('ajax传输失败'); }
    })
}

function changeAjax() {
    var url = 'http://172.20.76.90:8181/Health/app/dsServiceDynamicInfo/findAllList';
    $.ajax({
        type: "post",
        url: url,
        async: false,
        dataType: 'json',
        data: {
            id: 1
        },
        success: function(data) {
            var response = data.response;
            if (response) {
                var data1 = data.data.dsServiceDynamicInfo.products;
                console.log('传输成功');
                for (var i = 0; i < data1.length; i++) {
                    getchecked('#categoryName', data1[i].category.name);
                    $('#numberID').val(data1[i].info.id);
                    $('#infoName').val(data1[i].info.name);
                    getchecked('#city', data1[i].info.cityCode);
                    $('#posture').val(data1[i].info.posture);
                    $('#price').val(data1[i].info.price);
                    $('#serviceTotalTime').val(data1[i].info.serviceTotalTime);
                    $('#img').val(data1[i].info.img);
                    $('#description').val(data1[i].info.description);
                    isCheckboxSelected('input[name="serviceSupport"]', data1[i].info.serviceAssurance); //服务保障

                    $('#application').val(data1[i].info.application);
                    $('#impact').val(data1[i].info.impact);
                    $('#way').val(data1[i].info.way);
                    $('#supply').val(data1[i].info.supply);
                    $('#announcements').val(data1[i].info.announcements);
                    $('#orderInformation').val(data1[i].info.orderInformation);
                    $('#commissionRate').val(data1[i].info.commissionRate);
                }

            } else {}
        },
        error: function(data) { alert('输出失败'); }
    });
}

function SaveGetAjax(j) {
    var categoryName = $('#categoryName option:checked').text();
    var infoId = $('#numberID').val();
    var infoName = $('#infoName').val();
    var cityCode = $('#city option:checked').val();
    var posture = $('#posture').val();
    var price = $('#price').val();
    var serviceTotalTime = $('#serviceTotalTime').val();
    var infoImg = $('#img').val();
    var description = $('#description').val();
    var ServiceAssurance = $('input[name="serviceSupport"]').val(); //服务保障
    var Application = $('#application').val();
    var impact = $('#impact').val();
    var way = $('#way').val();
    var supply = $('#supply').val();
    var announcements = $('#announcements').val();
    var orderInformation = $('#orderInformation').val();
    var commissionRate = $('#commissionRate').val();
    var s = {};
    s.info = {};
    s.dyInfo = {};
    s.category = {};
    s.category.name = categoryName;
    s.info.id = infoId;
    s.info.name = infoName;
    s.info.img = infoImg;
    s.info.cityCode = cityCode;
    s.info.description = description;
    s.info.serviceTotalTime = serviceTotalTime;
    s.info.price = price;
    s.info.posture = posture;
    s.info.serviceAssurance = ServiceAssurance;
    s.info.application = Application;
    s.info.impact = impact;
    s.info.way = way;
    s.info.supply = supply;
    s.info.announcements = announcements;
    s.info.orderInformation = orderInformation;
    s.dyInfo.commissionRate = commissionRate;

    s.info.state = j;
    var SaleOrder = new Array;
    SaleOrder.push(s);
    console.log(JSON.stringify(SaleOrder));
    var url = 'http://172.20.76.90:8181/Health/app/dsServiceInfo/receive';

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        async: false,
        data: {
            SaleOrder: JSON.stringify(SaleOrder),
        },
        success: function(data) {

            console.log(data);
            var response = data.response;
            if (response) {
                alert('传输成功');
            } else {}
        },
        error: function(data) { alert('传输失败'); }
    })
}
//后台下拉框选中
function getchecked(selectId, optionValue) {
    var $option = $(selectId).children();
    var Value = optionValue;
    for (var i = 0; i < $option.length; i++) {
        var $optionVal = $option.eq(i).text();
        if ($optionVal == Value) {
            $option.eq(i).attr("selected", true);
        }
    }
}
//用于从后台的返回值多选的选中
function isCheckboxSelected(checkbox, value) {
    var $input = $(checkbox);
    var arrVal = new Array();
    arrVal = value.split(' ');
    // alert(isArray(arrVal));
    for (var i = 0; i < arrVal.length; i++) {
        // var valueMatch=arrVal[i];
        for (var j = 0; j < $input.length; j++) {
            var inputVal = $input.eq(j).val();
            if (inputVal == arrVal[i]) {
                $input.eq(j).attr('checked', true);
            } else {}
        }
    }
}
//清除空格工具类
function Clearspace(value) {
    return value.replace(/\s+/g, "") == "" ? null : value.replace(/\s+/g, "");
}