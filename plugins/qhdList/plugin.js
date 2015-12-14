(function()
{
	//获取企互动静态html编辑的div区域
	function getQhdContent(editor)
	{
		var element = editor.getSelection().getStartElement();	//获取当前光标所在位置的第一个标签
		
		while ( element ){
			var name = element.getName();
			if (name == 'html') { break }//跳出循环
			if ( /* name == 'div' &&  */element.hasClass('qhd-content') ){
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
	
	//获取当前鼠标所在位置的p标签的html内容，并且删除原来的p
	function getElement(editor)
	{
		var element = editor.getSelection().getStartElement();	//获取当前光标所在位置的第一个标签		

		while ( element ){
			var name = element.getName();
			if ( name == 'body' ) { break }//跳出循环
			if ( name == 'span' || name == 'strong' || name == 'p' || name == 'th' || name == 'td' || name =='div' || name =='ul' || name == 'h1' || name == 'h2' || name == 'h3' || name == 'h4' || name == 'h5' || name == 'h6'){				
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
	
	//获取列表（ul）标签
	function getUl( editor, element )
	{
		while ( element ){
			var name = element.getName();
			if ( name == 'body' ) { break }//跳出循环
			if ( name == 'ul' ){
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
	
	
	CKEDITOR.plugins.qhdList =
	{	
		getUiTabs : function( editor )
		{
			var uiTabs = [];

			// read UI tabs value from config
			var configUiTabs = editor.config.scayt_uiTabs || "1,1,1";

			// convert string to array
			configUiTabs = configUiTabs.split( ',' );

			// "About us" should be always shown for standard config
			configUiTabs[3] = "1";

			for ( var i = 0; i < 4; i++ ) {
				uiTabs[i] = (typeof window.scayt != "undefined" && typeof window.scayt.uiTags != "undefined")
								? (parseInt(configUiTabs[i],10) && window.scayt.uiTags[i])
								: parseInt(configUiTabs[i],10);
			}
			return uiTabs;
		} 
		
	};	
	
	var plugin = CKEDITOR.plugins.qhdList;	
	
	//处理下拉菜单的点击事件
	function customList( editor, className )
	{
		var listHtml = '',
			theElement = '',
			elementName = '',
			elementHtml = '',
			parentElement = '';
		
		theElement = getElement(editor);	//鼠标当前位置的html标签
		theElement = getUl(editor, theElement) ? getUl(editor, theElement) : theElement;	//判断是否为ul标签
		elementName = theElement.getName(); //鼠标当前位置的html标签的名称
		elementHtml = theElement.getHtml(); //鼠标当前位置的html标签的html内容
		parentElement =  theElement.getParent();	//鼠标当前位置的父级html标签
		
		switch( elementName )
		{				
			case 'ul':
				if( theElement.getAttribute('class') == className ){
					removeQhdList( editor );
				}else{
					//修改自定义列表图标
					theElement.setAttribute('class', className ); 
				}
			break;
			
			default:
				//默认添加自定义列表代码段
				if(elementHtml == '') elementHtml = '<br />';
				listHtml = '<ul class="'+ className + '"><li>' + elementHtml +  '</li></ul>';
				
				if( getQhdContent(editor) != null ){
					
					if( (elementName == 'span') || (elementName == 'strong') ||  (elementName == 'p') ||  (elementName == 'h1') ||  (elementName == 'h2') ||  (elementName == 'h3') ||  (elementName == 'h4') ||  (elementName == 'h5') ||  (elementName == 'h6') ){
						if ( theElement.hasNext() ){
							if ( CKEDITOR.env.ie6Compat ){
								//ie 6: 先删除，再添加					
								theElement.remove();
								editor.insertHtml(listHtml);
							}else{
								//非ie6: 先在下一个兄弟节点前添加，再删除
								var listUl =  new CKEDITOR.dom.element( 'ul' ),
									listLi =  new CKEDITOR.dom.element( 'li' )
									;							
								listLi.setHtml( elementHtml );
								listUl.addClass( className );
								listUl.append(listLi);
								listUl.insertBefore( theElement.getNext() );
								theElement.remove();
							}
							
						}else{
							//没有兄弟节点时，直接在父级最后面添加
							parentElement.appendHtml( listHtml );
							theElement.remove();	//删除原来所选择的html
						
						}
						
					}else if( (elementName == 'div') || (elementName == 'td') ||  (elementName == 'th') ){						
						theElement.setHtml( listHtml );	//标签为div、td、th包住时，直接设置html为列表的html
					}
					
				}	
		}
		
	}
	
	//删除自定义列表函数
	function removeQhdList( editor )
	{
		var listHtml = '',
			theElement = '',
			elementName = '',
			elementHtml = '',
			parentElement = '',
			liHtml = '',
			resultHtml = ''
			;
		
		theElement = getElement(editor);	//鼠标当前位置的html标签
		theElement = getUl(editor, theElement) ? getUl(editor, theElement) : theElement;	//判断是否为ul标签
		elementName = theElement.getName(); //鼠标当前位置的html标签的名称
		elementHtml = theElement.getHtml(); //鼠标当前位置的html标签的html内容
		parentElement = theElement.getParent();	//鼠标当前位置的父级html标签
		
		if ( theElement.hasNext() ){
			if ( CKEDITOR.env.ie6Compat ){
				//ie 6: 先删除，再添加
				for(var i=0; i<theElement.getChildCount(); i++){
					liHtml = theElement.getChild(i).getHtml();
					resultHtml += '<p>' + liHtml + '</p>';
				}
				theElement.remove();
				editor.insertHtml( resultHtml );				
				
			}else{
				//非IE6: 先在下一个兄弟节点前添加，再删除
				for(var i=0; i<theElement.getChildCount(); i++){
					var pElement =  new CKEDITOR.dom.element( 'p' );
					
					liHtml = theElement.getChild(i).getHtml();
					pElement.setHtml( liHtml );				
					pElement.insertBefore( theElement );	//删除情况比较特殊，插入在该元素之前。ie6 has bug
				}
				theElement.remove();
			}
			
		}else{
			//没有下一个兄弟节点时，直接在父级最后面添加，在删除
			for(var i=0; i<theElement.getChildCount(); i++){
				liHtml = theElement.getChild(i).getHtml();
				resultHtml += '<p>' + liHtml + '</p>';
			}
			parentElement.appendHtml( resultHtml );
			theElement.remove();
		}
		
	}
	
	
	// Add qhdList plugin.
	CKEDITOR.plugins.add( 'qhdList',
	{
		requires : [ 'menubutton' ],
		
		init : function( editor )
		{				
			var menuGroup = 'qhdListButton';
			editor.addMenuGroup( menuGroup );
			// combine menu items to render
			var uiMenuItems = {};			

			// always added
			uiMenuItems.ico_list_default =
			{
				label : '小黑点',
				icon  : this.path + 'ico_list/ico_list_default.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, ''); }
			};
			uiMenuItems.ico_list_square =
			{
				label : '小方块',
				icon  : this.path + 'ico_list/ico_list_square.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'square'); }
			};
			uiMenuItems.ico_list_circle =
			{
				label : '小圆圈',
				icon  : this.path + 'ico_list/ico_list_circle.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'circle'); }
			};
			uiMenuItems.ico_list_delta =
			{
				label : '小三角形',
				icon  : this.path + 'ico_list/ico_list_delta.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-delta'); }
			};
			uiMenuItems.ico_list_dot =
			{
				label : '向右反向标',
				icon  : this.path + 'ico_list/ico_list_dot.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-dot'); }
			};
			uiMenuItems.ico_list_favicon =
			{
				label : '五角星',
				icon  : this.path + 'ico_list/ico_list_favicon.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-favicon'); }
			};
			uiMenuItems.ico_list_download =
			{
				label : '向下箭头',
				icon  : this.path + 'ico_list/ico_list_download.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-download'); }
			};
			uiMenuItems.ico_list_check =
			{
				label : '打钩',
				icon  : this.path + 'ico_list/ico_list_check.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-check'); }
			};
			uiMenuItems.ico_list_arrow =
			{
				label : '小箭头',
				icon  : this.path + 'ico_list/ico_list_arrow.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-arrow'); }
			};
			uiMenuItems.ico_list_del =
			{
				label : '红叉',
				icon  : this.path + 'ico_list/ico_list_del.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-del'); }
			};
			uiMenuItems.ico_list_pen =
			{
				label : '笔',
				icon  : this.path + 'ico_list/ico_list_pen.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-pen'); }
			};
			uiMenuItems.ico_list_light =
			{
				label : '提示',
				icon  : this.path + 'ico_list/ico_list_light.gif',					
				group : menuGroup,
				onClick : function() { customList( editor, 'iconlist iconlist-light'); }
			};

			editor.addMenuItems( uiMenuItems );

			editor.ui.add( 'qhdList', CKEDITOR.UI_MENUBUTTON,
			{
				label : '编辑自定义列表',
				title : '编辑自定义列表',
				icon  : this.path + 'qhdList.gif',
				//className : 'cke_button_list',
				modes : { wysiwyg : 1 },				
				onMenu : function()
				{
					return {
						ico_list_default  : CKEDITOR.TRISTATE_OFF,
						ico_list_square   : CKEDITOR.TRISTATE_OFF,
						ico_list_circle   : CKEDITOR.TRISTATE_OFF,
						ico_list_delta    : CKEDITOR.TRISTATE_OFF,
						ico_list_dot      : CKEDITOR.TRISTATE_OFF,
						ico_list_favicon  : CKEDITOR.TRISTATE_OFF,
						ico_list_download : CKEDITOR.TRISTATE_OFF,
						ico_list_check    : CKEDITOR.TRISTATE_OFF,
						ico_list_arrow    : CKEDITOR.TRISTATE_OFF,
						ico_list_del      : CKEDITOR.TRISTATE_OFF,
						ico_list_pen      : CKEDITOR.TRISTATE_OFF,
						ico_list_light    : CKEDITOR.TRISTATE_OFF
					};
				}
			});
			
			editor.addCommand('removeQhdList',
			{
				exec : function( editor )
				{
					removeQhdList( editor );
				}
			});
			
			
			/* S 处理右键上下文菜单 */
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				//Register qhdList group;
				editor.addMenuGroup("qhdList", 208);

				editor.addMenuItems(
				{	
					mofifyQhdList :
					{
						label : '修改自定义列表',
						//command: 'customList',
						group : 'qhdList',
						icon: this.path + 'qhdList.gif',
						order : 1,
						getItems : function()
						{
							return {
								mofifyQhdList_01 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_02 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_03 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_04 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_05 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_06 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_07 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_08 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_09 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_10 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_11 : CKEDITOR.TRISTATE_OFF,
								mofifyQhdList_12 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					mofifyQhdList_01 :
					{
						label : '小黑点',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_default.gif',
						onClick : function() { customList( editor, ''); }
					},
					mofifyQhdList_02 :
					{
						label : '小方块',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_square.gif',
						onClick : function() { customList( editor, 'square'); }
					},
					mofifyQhdList_03 :
					{
						label : '小圆圈',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_circle.gif',
						onClick : function() { customList( editor, 'circle'); }
					},
					mofifyQhdList_04 :
					{
						label : '小三角形',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_delta.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-delta'); }
					},
					mofifyQhdList_05 :
					{
						label : '向右反向标',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_dot.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-dot'); }
					},
					mofifyQhdList_06 :
					{
						label : '五角星',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_favicon.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-favicon'); }
					},
					mofifyQhdList_07 :
					{
						label : '向下箭头',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_download.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-download'); }
					},
					mofifyQhdList_08 :
					{
						label : '打勾',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_check.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-check'); }
					},
					mofifyQhdList_09 :
					{
						label : '小箭头',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_arrow.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-arrow'); }
					},
					mofifyQhdList_10 :
					{
						label : '红叉',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_del.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-del'); }
					},
					mofifyQhdList_11 :
					{
						label : '笔',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_pen.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-pen'); }
					},
					mofifyQhdList_12 :
					{
						label : '提示',
						group : 'qhdList',
						icon: this.path + 'ico_list/ico_list_light.gif',
						onClick : function() { customList( editor, 'iconlist iconlist-light'); }
					},
					
					removeQhdList :
					{
						label : '删除自定义列表',
						command: 'removeQhdList',
						group : 'qhdList',
						icon: this.path + 'removeQhdList.gif',						
						order : 20
					}
				});
			}
			
			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
				{	
					if ( !element || element.isReadOnly() )
						return null;
					
					while ( element )
					{
						var name = element.getName();						
						if ( name == 'ul'){
							editor.contextMenu.removeAll();	//删除所有的上下文菜单
							return {
								mofifyQhdList : CKEDITOR.TRISTATE_OFF,
								removeQhdList : CKEDITOR.TRISTATE_OFF
							};
						}
						element = element.getParent();
					}
					return null;
					
				});
			}			
			/* E 处理右键上下文菜单 */
			
			/* S 设置自定义列表的当前状态 */
			editor.on( 'selectionChange', function( e )
			{
				//editor.getCommand('qhdList').setState(CKEDITOR.TRISTATE_OFF);
				var element = e.data.selection.getStartElement();	//获取当前选择的标签
				//alert( element );
				while ( element )
				{
					var name = element.getName();
					if ( name == 'ul' ){						
						editor.getCommand('bulletedlist').setState(CKEDITOR.TRISTATE_OFF);	//取消ul的当前状态
						//editor.getCommand('qhdList').setState(CKEDITOR.TRISTATE_ON);		//设置自定义列表的当前状态
					}
					element = element.getParent();
				}
				return null;
				
			})
			/* E 设置自定义列表的当前状态 */
		
		}	//end of init
	});
	
})();
