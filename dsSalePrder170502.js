var $checked=$('.checked td');
var state=$('#state option:checked').val();	
var startNum=1;//技师初始页
		$(function(){	
			var v = parseUrl();//解析所有参数
			
			/*console.log(state);*/
			if (GetQueryString("state")) {
					var v = parseUrl();//解析所有参数
					state=v['state']						
				} else{}
			if (GetQueryString("beginTime")) {
					var v = parseUrl();//解析所有参数
					var soNo=v['soNo']
					if (soNo==1) {
						var createTime=getNowFormatDate();
					} else{var createTime='';}
				} else{var createTime='';}

			getName();
			searchForm(state);
			$('#btnSubmit').click(function(){
				state=$('#state option:checked').val();	
				searchForm(state);
			});
			
		
			setInterval(function(){
				isCheck();isTechnician();
			},600);			
			//添加   状态关闭选中
			$('table').on('click','.btnClose',function(){
				$(this).parent().parent('tr').addClass('checked');				
			});
			//点击弹窗判断技师单选或多选
			$('table').on('click','.reassign',function(){
				$('.technician-checkbox').removeAttr('checked');
				$(this).parent().parent('tr').addClass('checked');
				var isAssign=$(this).html();
				if(isAssign=='改派'){
					$('.table').on('click','.technician-checkbox',function(){						
						$(this).prop('checked',true);
						$('.technician-checkbox').not($(this)).prop('checked',false);
					});
				}else{$('.table').off('click','.technician-checkbox');}
			});

			//新增数据            改派或指派
			$('body').off('click').on('click','#technician_button',function(){
				$('.new-order').removeClass('new-order');
				var $technicianCheckbox=$("input[name='technician-checkbox']");//技师弹窗的选择框
				var technicianNameID=[];
				var technicianName=[];//技师数组
				for (var i = 0; i < $technicianCheckbox.length; i++) {
					if ($technicianCheckbox[i].checked) {
//						console.log('TRUE');
						technicianName.push($technicianCheckbox.eq(i).parent('td').siblings().eq(0).html());					
						technicianNameID.push($technicianCheckbox.eq(i).parent('td').siblings().eq(0).attr('data-technicianID'));
					} else{}	
				}

				$checked=$('.checked td');
				//判断是否指定    指定修改本条数据    改派新增并修改数据
				var IsAssign=$checked.eq(2).children('button').html(); 
				console.log(IsAssign);//测试



				var orderID=$checked.eq(4).html();					
				if (IsAssign=='改派') {	
//					var createTime=getNowFormatDate();
//					console.log(createTime);
					var ajaxData=new Array;
					var str={};
					var $order=$checked.eq(0);
					var orderID=$checked.eq(4).html();
					
					var sid=$order.attr('data-sid'),
					id=$order.attr('data-id'),
					cid=$checked.eq(3).children('.client').attr('data-name'),
					uid=$order.attr('data-uid'),
					otherRequirement=$order.attr('data-otherRequirement'),
					tradeTime=$checked.eq(5).html(),
				    price=$checked.eq(6).html(),
				    referrer=$order.attr('data-referrer'),
				    referrerType=$order.attr('data-referrerType'),
				    createTime=$order.attr('data-createTime'),
				    appointServiceTime=$order.attr('data-appointServiceTime'),
				    transactionId=$order.attr('data-transactionId');
				    
//					str.tid=technicianNameID[0];
					str.sid=sid;str.cid=cid;str.uid=uid;str.otherRequirement=otherRequirement;
					str.tradeTime=tradeTime;str.tradePrice=price;str.referrer=referrer;
					str.referrerType=referrerType;str.appointServiceTime=appointServiceTime;
					str.createTime=createTime;
					str.transactionId=transactionId;
					str.tid=technicianNameID[0];
					str.type='xtpd';
//					str.state=$checked.eq(7).children('span').html();
					str.state='dfw';
					$checked.eq(7).children('span').html("已关闭").siblings('button').remove();
					ajaxData.push(str);
					console.log(JSON.stringify(ajaxData));
					//技师改派的
					var url='http://172.20.76.90:8181/Health/app/dsSaleOrder/iu';	
						$.ajax({
							type:'post',
							url:url,
							dataType:'json',
							async:false,//取消异步
							data:{
								id:id,
								state:'ygb',
								changeCommonReasons:'1'
							},
							success:function(data){
								alert('response已完成');
								var url='http://172.20.76.90:8181/Health/app/dsSaleOrder/receive';
								$.ajax({
									type:'post',
									url:url,
									dataType:'json',
									async:true,
									data:{
										dsOrders:JSON.stringify(ajaxData)
									},
									success:function(data){
										state=$('#state option:checked').val();
										searchForm(state);
										$checked.eq(2).children('.reassign').addClass('hide');
									},
									error:function(data){alert("传输失败")}
								});
								
							},
							error:function(data){
								console.log('ajax传输失败');
							}
						});
						$checked.eq(2).children('button').addClass('hide');
				} else{
					$checked.eq(1).html("<span  class='technicianName' data-name='"+technicianName+"'>"+technicianName+"</span><br/><span></span>"); 
					$checked.eq(2).children('button').html('改派'); 
					var PointTech=[];
					for (var i = 0; i < technicianNameID.length; i++) {
						var s={};
						s.tid=technicianNameID[i];
						s.soNo=orderID;
						PointTech.push(s);
					}
//					console.log(JSON.stringify(PointTech));
					var url='http://172.20.76.90:8181/Health/app/dsSaleOrder/receivePointTech';	
						$.ajax({
							type:'post',
							url:url,
							dataType:'json',
							async:false,//取消异步
							data:{
								PointTech:JSON.stringify(PointTech)
							},
							success:function(data){
								alert('ajax传success');
							},
							error:function(data){
								console.log('ajax传输失败');
							}
						});
				}

				

				
				
			//	console.log(orderID);
			//与后台进行数据交互			
			});			
			//跳转详情
			$('table').on('click','.details-button',function(){
				$datail=$(this).parent().siblings();
				var type=$datail.eq(0).html();		/*项目类型*/					
				var olderTechnician=$datail.eq(1).children('.technicianName').html();
				var olderTechnicianID=$datail.eq(1).children('.technicianName').attr('data-technicianID');						
				var client=$datail.eq(3).children('.client').html(); /*客户*/
				var clientID=$datail.eq(3).children('.client').attr('data-clientID'); /*客户编号*/
				var orderID=$datail.eq(4).html();
				orderID=1;
//				window.location.href="details.html?name="+type+"&tid="+olderTechnicianID+"&technicianrealName="+olderTechnician+"&soNo="+orderID+"&customerrealName="+client+"&cid="+clientID+"";
				 var url='http://172.20.76.90:8181/Health/app/dsTechnician/skipWeb.do';
				 $.ajax({
				 	type:'post',
					url:url,
					dataType:'json',
					async:false,//取消异步
				 	data:{
				 		soNo:orderID
				 	},
				 	success:function(data){
				 		window.location.href='details.html?soNo='+orderID;	
				 	},
				 	error:function(data){alert('传输失败');}
				 });
			});
//			删除事件
//			$('table').on('click','.delete-button',function(){		
//				$(this).parent().parent('tr').remove();	
//			});	
			var $selectStyle=$('#selectStyle option:selected');
			var $technicianSelect=$('#technicianSelect');
		$('#search').click(function(){

			technicianSelectAjax();
		});
//		technicianSelectAjax();
});
	
		//技师列表后台显示  查询
var technicianSelectAjax=function (){
			$selectStyle=$('#selectStyle option:selected');
		 	$technicianSelect=$('#technicianSelect');
			var selectStyle=$selectStyle.val();
			alert(selectStyle);
			var technicianSelectname=$technicianSelect.val();
			
			var url="http://172.20.76.90:8181/Health/app/dsSaleOrder/getOrderMutiTech";
			$.ajax({
				type:'post',
				url:url,
				dataType:'json',
				async:false,//取消异步
				data:{
					category:selectStyle,
					TechnicianloginName:technicianSelectname
				},
				success:function(data){
					resultstate=data.response;
					if (resultstate) {
						var arr=new Array;
						arr=data.data.dsPointTech;
//						console.log(arr.length);
						var trHtml='';
						var TechnicianState='--';
						var TechnicianSex='--';

						for (var i = 0; i < arr.length; i++) {
							//计算年龄		
//							console.log(arr[i].appraise.muiltpraise);
							var states=arr[i].technician.state;
							var sex=arr[i].technician.sex;
							switch (states){
								case 'jdz': TechnicianState='接单中';
									break;
								case 'xxz': TechnicianState='休息中';
									break;
								default:
									break;
							};
							switch (sex){
								case "1": TechnicianSex='男';
									break;
								case "2": TechnicianSex='女';
									break;
								default:
									break;
							}
							trHtml+="<tr>"+
										"<td data-technicianID='"+arr[i].order.tid+"'>"+arr[i].technician.realName+"</td>"+
										"<td data-mobilephone='"+arr[i].technician.loginName +"'>"+TechnicianSex+"</td>"+
										"<td>"+arr[i].technician.dateOfBirth+"</td>		"+					
										"<td>"+arr[i].skill.specialityDesc+"</td>"+
										"<td>"+arr[i].technician.createTime+"</td>"+
										"<td>"+arr[i].serNum+"</td>"+
										"<td>"+arr[i].num+"</td>"+
										"<td>"+arr[i].appraise.muiltpraise+"</td>"+
										"<td>"+TechnicianState+"</td>"+
										"<td>"+
											"<input name='technician-checkbox' type='checkbox' class='technician-checkbox'/>"+
										"</td>"+
									"</tr>";
						}
						$('#technicianList').empty().append(trHtml);						
					} else{}
				},
				error:function(data){
					alert("从后台接受失败");
					console.log('ajax传输失败');

				}
			});
		}
function getLocalTime(ns) { 
					//			可以转化10位(13位)
		    var d = new Date(ns);  
		    var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')   
		            + ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');  
		    return dformat;  
	}
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
//form提交的函数
	function searchForm(j) {
		var name=$('#name option:checked').val();	
		var cid=$('#cid').val();	
		var tid=$('#tid').val();	
		
		var beginCreateTime=$('#beginCreateTime').val();	
		var endCreateTime=$('#endCreateTime').val();	
				
		var url='http://172.20.76.90:8181/Health/app/dsSaleOrder/getOrderMuti';
		$.ajax({
			type:'post',
			url:url,
			dataType:'json',
			async:false,
			data:{
				name:name,
				cid:cid,
				tid:tid,
				state:j,
				beginCreateTime:beginCreateTime,
				endCreateTime:endCreateTime,
				createTime:createTime
			},
			success:function(data){
				var response=data.response;
				if (response) {
					var data=data.data.dsPointTech;
					$('#order-table').empty();
					for (var i = 0; i < data.length; i++) {
//						console.log(JSON.stringify(data[0]));
						var state=data[i].order.state;
						state=stateChange(state);
						if (state=="待服务") {
							var newTr_2="<td class='button1'>"+
										"<button  class='btn btn-primary btn-sm reassign ' data-toggle='modal' data-target='#myModal'>改派</button>"+
									"</td>";
						} else{
							var newTr_2="<td class='button1'>"+
										"<button style='display:none;' class='btn btn-primary btn-sm reassign hide' data-toggle='modal' data-target='#myModal'>改派</button>"+
									"</td>";
						}
						var newTr="<tr class='new-order'>"+
								"<td data-sid='"+data[i].order.sid+"' data-uid='"+
								data[i].order.uid+"' data-otherRequirement='"+
								data[i].order.otherRequirement+"' data-referrer='"+
								data[i].order.referrer+"' data-referrerType='"+
								data[i].order.referrerType+"' data-referrerType='"+
								data[i].order.referrerType+"' data-createTime='"+
								data[i].order.createTime+"' data-appointServiceTime='"+
								data[i].order.appointServiceTime+"'data-transactionId='"+
								data[i].order.transactionId+"' data-id='"+data[i].order.id+"' >"+data[i].serviceInfo.name+"</td>";
						var newTr_1="<td><span  class='technicianName' data-name='"+data[i].order.tid+"'>"+data[i].technician.realName+"</span><br/><span class='technicianPhone' data-name='"+data[i].technician.loginName+"'>"+data[i].technician.loginName+"</span></td>";

						var newTr_3="<td><span class='client' data-name='"+data[i].order.cid+"'>"+data[i].devuserinfobaby.username+"</span><br /><span class='clientPhone'>"+data[i].userinfobaby.mobile+"</span></td>"+
									"<td>"+data[i].order.soNo+"</td>"+
								"	<td>"+data[i].order.tradeTime+"</td>"+
								"	<td>"+data[i].order.tradePrice+"</td>"+
									"<td><span class='order-states'>"+state+"</span><br></td>"+
									"<td>"+
										"<button class='btn btn-primary btn-xs details-button'>详情</button>&nbsp;"+
										"<button class='btn btn-primary btn-xs delete-button'>删除</button>"+
									"</td>"+
								"</tr>";
					var newTr=newTr+newTr_1+newTr_2+newTr_3;
					$('#order-table').append(newTr);							
					}
					isStates();
				} else{}
			},
			error:function(data){
				alert('传输失败');
			}
		});
			}
	

function stateChange(j){
	switch (j){
			case 'dqr': j='待确认';
				break;
			case 'dfk': j='待付款';
				break;
			case 'dfw': j='待服务';
				break;
			case 'ywc': j='已完成';
				break;
			case 'ygb': j='已关闭';
				break;
			case 'fwz': j='服务中';
				break;
			case 'fwz': j='待退款';
				break;
			case 'fwz': j='已退款';
				break;
			case 'fwz': j='取消中';
				break;
			default:
				break;
		}
	return j;
}
//获取服务类型
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
				var data=data.data;
				var option='<option value="" selected="selected">全部</option>';
				for (var i = 0; i < data.length; i++) {
					option+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
				}
				$('#name').empty().append(option);
			} else{}
		},
		error:function(data){alert('ajax传输失败');}
	})
}

//实时监测改派事件
function isCheck(){
	if($('.fade').is('.in')){}else{$('.checked').removeClass('checked')}
}
//判断指定
function isTechnician(){
	var $technicianNameArra=$('.technicianName');
	for (var i = 0; i < $technicianNameArra.length; i++) {
		var $technicianNameValue=$technicianNameArra.eq(i).html();
		if($technicianNameValue==''){
			$technicianNameArra.eq(i).parent('td').next('td').children('.reassign').html('指定');
		}else{}
	}
}
//判断订单状态添加按钮
function isStates(){
	var orderState=$('.order-states');
	for(var i=0;i < orderState.length;i++){
		var orderStateText=orderState.eq(i).html();
		switch(orderStateText){
			case '待确认': orderState.eq(i).parent().append("<button class='btn btn-primary btn-xs btnClose' data-toggle='modal' data-target='#myModal_close'>关闭</button>");
			break;
			case '待付款': orderState.eq(i).parent().append("<button class='btn btn-primary btn-xs btnClose' data-toggle='modal' data-target='#myModal_close'>关闭</button>");
			break;
			case '待服务': orderState.eq(i).parent().append("<button class='btn btn-primary btn-xs btnClose' data-toggle='modal' data-target='#myModal_close'>关闭</button>");
			break;
			case '取消中': orderState.eq(i).parent().append("<button class='btn btn-primary btn-xs btnRefund' data-toggle='modal' data-target='#myModal_refund'>退款</button>");
			break;
			default:;
		}
	}
}

//获取url里面的参数
function parseUrl(){
	                var url=location.href;
	                var i=url.indexOf('?');
	                if(i==-1)return;
	                var querystr=url.substr(i+1);
	                var arr1=querystr.split('&');
	                var arr2=new Object();
	                for  (i in arr1){
	                    var ta=arr1[i].split('=');
	                    arr2[ta[0]]=ta[1];
	                }
	                return arr2;
	           }
//js 判断url的?后参数是否包含某个字符串
function GetQueryString(name){ 
   var reg=eval("/"+name+"/g");
   var r = window.location.search.substr(1); 
   var flag=reg.test(r);
   if(flag){
        return true;
   }else{
       return false;
   } 
}
