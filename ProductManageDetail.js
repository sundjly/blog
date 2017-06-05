var state='';
$(function(){
	$('#btnSubmit').click(function(){
		state='fbz';
	SaveGetAjax(state);
	});
	getCity();getName();
});
function getCity(){
	var url='http://172.20.76.90:8181/Health/app/dsSysArea/queryList';
	$.ajax({
		type:'post',
		url:url,
		dataType:'json',
		async:false,
		data:{},
		success:function(data){
			var response=data.response;
			if (response) {
				var data=data.data;
				var option='<option value="">-请选择-</option>';
				for (var i = 0; i < data.length; i++) {
					option+='<option value="'+data[i].code+'">'+data[i].name+'</option>';
				}
				$('#city').empty().append(option);
			} else{}
		},
		error:function(data){alert('ajax传输失败');}
	})
}

//获取项目类型
function getName(){
	var url='http://172.20.76.90:8181/Health/app/dsServiceCategory/queryList';
	$.ajax({
		type:'post',
		url:url,
		dataType:'json',
		async:false,
		data:{},
		success:function(data){
			var response=data.response;
			if (response) {
				var data1=data.data;
				var option='<option value="">-请选择-</option>';
				for (var i = 0; i < data1.length; i++) {
					option+='<option value="'+data1[i].id+'">'+data1[i].name+'</option>';
				}
				$('#categoryName').empty().append(option);
			} else{}
		},
		error:function(data){alert('ajax传输失败');}
	})
}
function changeAjax(){
	var url='';
	$.ajax({
		type:"post",
		url:url,
		async:false,
		dataType:'json',
		data:{},
		success:function(data){
			var response=data.response;
			if (response) {
				var data=data.data;
				
				$('#categoryName option:checked').text();
				$('#numberID').val();
				$('#infoName').val();
				$('#city option:checked').val();
				$('#posture').val();
				$('#price').val();
				$('#serviceTotalTime').val();
				$('#img').val();
				$('#description').val();
				$('input[name="serviceSupport"]').val();//服务保障
				$('#application').val();
				$('#impact').val();
				$('#way').val();
				$('#supply').val();
				$('#announcements').val();
				$('#orderInformation').val();
				$('#commissionRate').val();
			} else{}
		},
		error:function(data){alert('输出失败');}
	});
}
function SaveGetAjax(j){
	var categoryName=$('#categoryName option:checked').text();
	var infoId=$('#numberID').val();
	var infoName=$('#infoName').val();
	var cityCode=$('#city option:checked').val();
	var posture=$('#posture').val();
	var price=$('#price').val();
	var serviceTotalTime=$('#serviceTotalTime').val();
	var infoImg=$('#img').val();
	var description=$('#description').val();
//	var ServiceAssurance=$('input[name="serviceSupport"]').val();//服务保障
	var $service=$('input[name="serviceSupport"]');//服务保障
	var ServiceAssurance='';
	for(var i=0;i <$service.length;i++ ){
		if($service[i].checked){
			ServiceAssurance+=""+($service[i].value)+",";
		}
	}
	alert(ServiceAssurance);
	var Application=$('#application').val();
	var impact=$('#impact').val();
	var way=$('#way').val();
	var supply=$('#supply').val();
	var announcements=$('#announcements').val();
	var orderInformation=$('#orderInformation').val();
	var commissionRate=$('#commissionRate').val();
	var s={};
	 s.info={};
	 s.dyInfo={};
	 s.category={};
	 s.category.name=categoryName;
	 s.info.id=infoId;
	 s.info.name=infoName;
	 s.info.img=infoImg;
	 s.info.cityCode=cityCode;
	 s.info.description=description;
	 s.info.serviceTotalTime=serviceTotalTime;
	 s.info.price=price;
	 s.info.posture=posture;
	 s.info.serviceAssurance=ServiceAssurance;
	 s.info.application=Application;
	 s.info.impact=impact;
	 s.info.way=way;
	 s.info.supply=supply;
	 s.info.announcements=announcements;
	 s.info.orderInformation=orderInformation;
	 s.dyInfo.commissionRate=commissionRate;
	 
	 s.info.state=j;
	var SaleOrder=new Array;
	SaleOrder.push(s);
	console.log(JSON.stringify(SaleOrder));
	var url='http://172.20.76.90:8181/Health/app/dsServiceInfo/receive';
	
	$.ajax({
		type:'post',
		dataType:'json',
		url:url,
		async:false,
		data:{
			SaleOrder:JSON.stringify(SaleOrder),
		},
		success:function(data){
			
			console.log(data);
			var response=data.response;
			if (response) {
				alert('传输成功');
			} else{}
		},
		error:function(data){alert('传输失败');}
	})
}

function getchecked(selectId,optionValue){
	var $option=$(selectId).children();
	var Value=optionValue;
	for (var i = 0; i < $option.length; i++) {
		var $optionVal=$option.eq(i).val();
		if ($optionVal==Value) {
			$option.eq(i).attr("selected",true);
		} else{}
	}
}
//清除空格工具类
function  Clearspace(value)
{
	return value.replace(/\s+/g,"")==""?null:value.replace(/\s+/g,"");
}