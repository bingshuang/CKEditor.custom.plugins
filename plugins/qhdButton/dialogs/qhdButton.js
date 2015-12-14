/*
 * qhd Ckeditor qhdButton.js v2.0
 * create the time 2013.2.24
*/

function getIframe (name) 
{
	var iframe;
    if (document.all){//IE
		iframe = document.frames[name].document;
    }else{//Firefox    
		iframe = document.getElementById(name).contentDocument;
    }
	return iframe;
}

// get element by class
function getByClass (className, parent) 
{
  parent || (parent=document);
  var descendants=parent.getElementsByTagName('*'), i=-1, e, result=[];
  while (e=descendants[++i]) {
	((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) && result.push(e);
  }
  return result;
}
	
//获取选中的文本内容
function getSelectedText (editor) 
{
	var data="";  
	var mySelection = editor.getSelection();
	if (CKEDITOR.env.ie) {
		mySelection.unlock(true);
		data = mySelection.getNative().createRange().text;
		mySelection.lock(true);
	} else {
		data = mySelection.getNative();
	}
	return data;
}


/* S dialog */	
CKEDITOR.dialog.add( 'qhdButton', function ( editor )
{	
	return {
		title : '插入/编辑按钮',
		minWidth : 500,
		minHeight : 450,
		buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],			
		resizable: CKEDITOR.DIALOG_RESIZE_BOTH,	//对话框是否可以被调整
		
		contents :
		[
			{
				id : 'button_info',
				label : '超链接',
				elements :
				[					
					// UI elements of the second tab will be defined here
					{
						type : 'text',
						id : 'button_cont',
						label : '文本内容',						
						required : true,
						setup : function( element )
						{								
							if ( getSelectedText(editor) && getSelectedText(editor) != '' ){
								this.setValue( getSelectedText(editor) );
							}else{
								this.setValue( element.getText() );	
							}					
						},
						commit : function( element )
						{							  					
							element.getFirst().setText( this.getValue() );	//修改span里面的文字内容
							// alert( element.getFirst().getText() );
						}
					},
					{
						type : 'text',
						id : 'button_title',
						label : '提示内容',						
						required : true,
						setup : function( element )
						{
							this.setValue( element.getAttribute( "title" ) );
						},
						commit : function( element )
						{							
							element.setAttribute( 'title', this.getValue() );
							// alert( element.getAttribute('title') );
						}
					},
					{
						type : 'text',
						id : 'button_url',
						label : '链接地址',						
						required : true,
						setup : function( element )
						{
							this.setValue( element.getAttribute( "href" ) );
						},
						commit : function( element )
						{							
							var buttonHref = this.getValue() ? this.getValue() : 'javascript:;';							
							element.setAttribute( 'href', buttonHref );
							element.setAttribute( 'data-cke-saved-href', buttonHref );
							// alert( element.getAttribute('href') );
						}
					},
					{
						type : 'html',
						html:'<span style="color:#666;">提示：若是电子邮箱，则按后面括号的格式在上栏中填入（maito:邮箱）</span>'
					},					
					{
						type : 'checkbox',
						id : 'button_newPage',
						label : '新窗口打开',
						'default' : false,
						commit : function( element )
						{							
							if ( this.getValue() ){
								element.setAttribute( 'target', '_blank' );
							}else{
								element.removeAttribute('target');
							}						
							// alert( element.getAttribute('target') );
						}
					},
					{
						type : 'text',
						id : 'button_class',
						className : 'button_class',
						label : '按钮的class类名',
						style : 'display:none; margin:-10px 0',
						setup : function( element )
						{		
											
							var buttonClass = element.getAttribute('class') ? element.getAttribute('class') : element.getAttribute('className') ;
							this.setValue( buttonClass );
							
							//获取iframe的值。
							var buttonSelectIframe = getIframe ('buttonSelectIframe'),
								buttonBox = buttonSelectIframe.getElementById('button_box'),
								buttonBoxItem = getByClass('button_box_item', buttonBox);
							
							for(var i=0; i<buttonBoxItem.length; i++){
								var buttonElement = buttonBoxItem[i].getElementsByTagName('a')[0],
									buttonClass = buttonElement.getAttribute('class') ? buttonElement.getAttribute('class') : buttonElement.getAttribute('className'); 
								
								//初始化所有的按钮box的class
								for(var j=0; j<buttonBoxItem.length; j++){
									buttonBoxItem[j].setAttribute('class','button_box_item');
									buttonBoxItem[j].className = "button_box_item";	//for IE
									//buttonBoxItem[j].setAttribute('className','button_box_item');	//for IE
									
								}
								if( buttonClass == this.getValue() ){
									buttonBoxItem[i].setAttribute('class','button_box_item item_select');
									buttonBoxItem[i].className = "button_box_item item_select";	//for IE
									// buttonBoxItem[i].setAttribute('className','button_box_item item_select'); //for IE
									break;
								}
							}
							
						},
						commit : function( element )
						{				
							element.setAttribute( 'class', this.getValue() );							
							// alert( element.getAttribute('class') );
						}
					},
					{
						type : 'html',
						id : 'buttonSelect',
						html: 
						'<div id="div1" style="width:640px; height:250px; background-color:#fff">' + 
							'<iframe id="buttonSelectIframe" name="buttonSelectIframe" frameborder="0" style="width:640px; height:250px;" src ="' + CKEDITOR.basePath + 'plugins/qhdButton/dialogs/buttonSelect.html"></iframe>' + 
						'</div>'
					}
				]
			}
			
		],	//end of contents
		
		onShow: function(element)
		{
			//onShow event
			if ( CKEDITOR.env.ie )
			{				
				editor.focus();	//ie6 7有效果			
			}
			
			var sel = editor.document.getSelection(),
				element = sel.getStartElement();			
			
			if ( element )
				element = element.getAscendant( 'a', true );
			
			
			if ( !element || element.getName() != 'a' || element.data( 'cke-realelement' ) )
			{
				element = editor.document.createElement( 'a' );
				this.insertMode = true;
			}else{
				this.insertMode = false;
			}
			this.element = element;		
			this.setupContent( this.element );
			
		},
		
		onOk: function(element)
		{
			// onOk event
			//alert( 'onOk event' )
			var buttonSelectIframe = getIframe ('buttonSelectIframe');
			//alert( buttonSelectIframe.getElementById('button_box').innerHTML );
			
			var dialog = this,
				btn = this.element,
				getSelectionContent = '',
				button = editor.document.createElement( 'a' ),
				span = editor.document.createElement( 'span' )				
				;
			
			if ( this.insertMode ){	
				//插入模式
				var	buttonCont = this.getValueOf( 'button_info', 'button_cont' ),
					buttonTitle = this.getValueOf('button_info', 'button_title'),
					buttonUrl = this.getValueOf('button_info', 'button_url'),
					buttonNewPage = this.getValueOf('button_info', 'button_newPage'),
					buttonClass = this.getValueOf('button_info', 'button_class');
					//buttonClass = buttonSelectIframe.getElementById('buttonClassValue').value;
				
				buttonUrl = buttonUrl ? buttonUrl : 'javascript:;';
				getSelectionContent = buttonCont ? buttonCont : buttonUrl;
				buttonTitle = buttonTitle ? buttonTitle : buttonCont;				
				
				if ( buttonNewPage ) { button.setAttribute( 'target', '_blank' ); }
				if ( buttonClass ){
					span.setHtml( getSelectionContent );				
					button.append( span );
					button.setAttribute( 'href', buttonUrl );
					button.setAttribute( 'title', buttonTitle );
					button.setAttribute( 'class', buttonClass );
					editor.insertElement( button );
				}else{
					button.setAttribute( 'href', buttonUrl );
					button.setAttribute( 'title', buttonTitle );
					button.setHtml( getSelectionContent );
					editor.insertElement( button );
				}
			}else{
				//修改模式
				//alert(btn.getChild(0).type == CKEDITOR.NODE_TEXT);
				//alert(btn.getChild(0).type == CKEDITOR.NODE_ELEMENT && btn.getChild(0).getName() != 'span');
				
				if( (btn.getChild(0).type == CKEDITOR.NODE_TEXT) || (btn.getChild(0).type == CKEDITOR.NODE_ELEMENT && btn.getChild(0).getName() != 'span') ) 
				{	
					//alert( '需要添加一个span标签' );					
					/*var btnText = btn.getHtml();
					btn.setHtml( '<span>'+ btnText +'</span>' );*/
					
					span.setHtml( btn.getHtml() );
					btn.setHtml( '' );					
					btn.append( span );
				}
				this.commitContent( btn );				
			}
			
		}	//end of onOK event
		
		
	};
	
}); 

/* E dialog */