(function()
{
	// 通过class来获取特定div区域，返回该element或者null
	function getDivElementByClass(editor, className)
	{
		var element = editor.getSelection().getStartElement();	//获取当前光标所在位置的第一个标签
		
		while ( element ){
			var name = element.getName();
			//alert(element);
			if (name == 'body') { break }//跳出循环
			if ( name == 'div' && element.hasClass(className) ){
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
		
	CKEDITOR.plugins.qhdColumn =
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
	
	var plugin = CKEDITOR.plugins.qhdColumn;	
	
	// 插入静态内容多列
	function inserColumn( editor, columnClass ){
		//alert('插入'+ columnClass +'列');
		var aColumnClass = columnClass.split(','),
			className = '',
			columnHtml = '';
		
		for(var i=0; i<aColumnClass.length; i++){
			className = aColumnClass[i];
			if ( i == aColumnClass.length -1 ) { className = aColumnClass[i] + ' last'; }
			columnHtml += '<div class="' + className + '"><p>网站外观风格主题、页面布局、内容的显示方式、企业徽标只需点击选择就可变换，方便之极，又可减少开支预算。</p></div>'
		}
		columnHtml = '<div class="column">' + columnHtml + '</div>';		
		
		if( getDivElementByClass(editor, 'qhd_content') != null ){
			editor.insertHtml(columnHtml);
		}else{
			var qhdContent = editor.document.createElement( 'div' );			
			qhdContent.setAttribute( 'class', 'qhd_content' );
			qhdContent.setHtml( columnHtml );			
			editor.insertElement( qhdContent );
		}
		
	}
	
	// 修改静态内容多列
	function modifyColumn ( editor, columnClass ) {
		// alert('新的多列：' + columnClass );
		if ( getDivElementByClass(editor, 'column') != null ){
			var columnElement = getDivElementByClass(editor, 'column'),
				aColumnClass = columnClass.split(','),
				childCount = columnElement.getChildCount(),
				className = '',
				columnHtml = '';
				
			// alert( childCount );
			
			if( childCount < aColumnClass.length ){				
				// 少变多				
				var i,j;
				for(i=0,j=0; i<childCount; i++,j++){
					var childHtml = columnElement.getChild(i).getHtml();					
					className = aColumnClass[i];					
					columnHtml += '<div class="' + className + '">' + childHtml + '</div>';					
				}
				//剩下列数补上默认的html
				for(j; j<aColumnClass.length; j++){
					className = aColumnClass[j];
					if ( j == aColumnClass.length -1 ) { className = aColumnClass[j] + ' last'; }
					columnHtml += '<div class="' + className + '"><p>网站外观风格主题、页面布局、内容的显示方式、企业徽标只需点击选择就可变换，方便之极，又可减少开支预算。</p></div>';					
				}
				columnElement.setHtml( columnHtml );
			}else{
				// 多变少、相等
				var i,j;
				for(i=0,j=0; i<aColumnClass.length; i++,j++){
					var childHtml = columnElement.getChild(i).getHtml();					
					className = aColumnClass[i];
					if ( i == aColumnClass.length -1 ) { className = aColumnClass[i] + ' last'; }
					columnHtml += '<div class="' + className + '">' + childHtml + '</div>';					
				}
				columnElement.setHtml( columnHtml );
			}			
		}
	}
	
	// 调整多列的间距
	function modifyQhdColumnMarg( editor, marginClass){
		//alert( '间距为:' + marginClass );
		var element = editor.getSelection().getStartElement();	//获取当前鼠标所在的标签		
		if ( !element || element.isReadOnly() ) return null;
		
		if ( getDivElementByClass(editor, 'column') != null ){
			var columnElement = getDivElementByClass(editor, 'column');
			columnElement.setAttribute( 'class', 'column '+ marginClass);
		}
	}
	
	
	// Add qhdColumn plugin.
	CKEDITOR.plugins.add( 'qhdColumn',
	{
		requires : [ 'menubutton' ],
		
		init : function( editor )
		{	
			var uiTabs = plugin.getUiTabs( editor );

			var menuGroup = 'columnTwoButton';
			editor.addMenuGroup( menuGroup );
			// combine menu items to render
			var uiMenuItems = {};			

			// 两列布局按钮的下拉菜单
			uiMenuItems.inserColumnTwo_01 =
			{
				label : '两列：1/2 + 1/2',
				// icon  : this.path + 'images/column-2-01.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-2-1,col-2-1');
				}
			};
			uiMenuItems.inserColumnTwo_02 =
			{
				label : '两列：1/3 + 2/3',
				// icon  : this.path + 'images/column-2-02.gif',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-3-1,col-3-2');
				}
			};			
			uiMenuItems.inserColumnTwo_03 =
			{
				label : '两列：2/3 + 1/3',
				// icon  : this.path + 'images/column-2-03.gif',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-3-2,col-3-1');
				}
			};
			uiMenuItems.inserColumnTwo_04 =
			{
				label : '两列：1/4 + 3/4',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-1,col-4-3');
				}
			};			
			uiMenuItems.inserColumnTwo_05 =
			{
				label : '两列：3/4 + 1/4',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-3,col-4-1');
				}
			};
			uiMenuItems.inserColumnTwo_06 =
			{
				label : '两列：2/5 + 3/5',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-2,col-5-3');
				}
			};
			uiMenuItems.inserColumnTwo_07 =
			{
				label : '两列：3/5 + 2/5',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-3,col-5-2');
				}
			};
			uiMenuItems.inserColumnTwo_08 =
			{
				label : '两列：1/5 + 4/5',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-4');
				}
			};
			uiMenuItems.inserColumnTwo_09 =
			{
				label : '两列：4/5 + 1/5',
				// icon  : this.path + 'columnTwo-8-2.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-4,col-5-1');
				}
			};

			
			// 三列布局按钮的下拉菜单
			uiMenuItems.inserColumnThree_01 =
			{
				label : '三列：1/3 + 1/3 + 1/3',
				// icon  : this.path + 'images/column-3-01.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-3-1,col-3-1,col-3-1');
				}
			};
			uiMenuItems.inserColumnThree_02 =
			{
				label : '三列：1/4 + 1/4 + 2/4',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-1,col-4-1,col-4-2');
				}
			};
			uiMenuItems.inserColumnThree_03 =
			{
				label : '三列：1/4 + 2/4 + 1/4',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-1,col-4-2,col-4-1');
				}
			};
			uiMenuItems.inserColumnThree_04 =
			{
				label : '三列：2/4 + 1/4 + 1/4',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-2,col-4-1,col-4-1');
				}
			};
			uiMenuItems.inserColumnThree_05 =
			{
				label : '三列：1/5 + 1/5 + 3/5',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-1,col-5-3');
				}
			};
			uiMenuItems.inserColumnThree_06 =
			{
				label : '三列：1/5 + 3/5 + 1/5',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-3,col-5-1');
				}
			};
			uiMenuItems.inserColumnThree_07 =
			{
				label : '三列：3/5 + 1/5 + 1/5',
				// icon  : this.path + 'columnTwo-6-4.png',
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-3,col-5-1,col-5-1');
				}
			};
			
			// 四列布局按钮的下拉菜单
			uiMenuItems.inserColumnFour_01 =
			{
				label : '四列：1/4 + 1/4 + 1/4 + 1/4',
				// icon  : this.path + 'images/column-4-01.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-4-1,col-4-1,col-4-1,col-4-1');
				}
			};
			uiMenuItems.inserColumnFour_02 =
			{
				label : '四列：1/5 + 1/5 + 1/5 + 2/5',
				// icon  : this.path + 'images/column-4-02.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-1,col-5-1,col-5-2');
				}
			};
			uiMenuItems.inserColumnFour_03 =
			{
				label : '四列：1/5 + 1/5 + 2/5 + 1/5',
				// icon  : this.path + 'images/column-4-03.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-1,col-5-2,col-5-1');
				}
			};
			uiMenuItems.inserColumnFour_04 =
			{
				label : '四列：1/5 + 2/5 + 1/5 + 1/5',
				// icon  : this.path + 'images/column-4-04.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-2,col-5-1,col-5-1');
				}
			};
			uiMenuItems.inserColumnFour_05 =
			{
				label : '四列：2/5 + 1/5 + 1/5 + 1/5',
				// icon  : this.path + 'images/column-4-04.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-2,col-5-1,col-5-1,col-5-1');
				}
			};
			
			// 五列布局按钮的下拉菜单
			uiMenuItems.inserColumnFive_01 =
			{
				label : '五列：1/5 + 1/5 + 1/5 + 1/5 + 1/5',
				// icon  : this.path + 'images/column-5-01.gif',					
				group : menuGroup,
				onClick : function()
				{
					inserColumn(editor, 'col-5-1,col-5-1,col-5-1,col-5-1,col-5-1');
				}
			};
			
			
			editor.addMenuItems( uiMenuItems );
			
			//两列按钮
			editor.ui.add('qhdColumnTwo', CKEDITOR.UI_MENUBUTTON,
			{
				label : '插入两列布局',
				title : '插入两列布局',
				icon  : this.path + 'images/column-2-01.gif',
				className : 'cke_button_column',
				modes : { wysiwyg : 1 },				
				onMenu : function()
				{
					return {
						inserColumnTwo_01 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_02 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_03 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_04 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_05 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_06 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_07 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_08 : CKEDITOR.TRISTATE_OFF,
						inserColumnTwo_09 : CKEDITOR.TRISTATE_OFF
					};
				}
			});
			
			//三列按钮
			editor.ui.add('qhdColumnThree', CKEDITOR.UI_MENUBUTTON,
			{
				label : '插入三列布局',
				title : '插入三列布局',
				icon  : this.path + 'images/column-3-01.gif',
				className : 'cke_button_column',
				modes : { wysiwyg : 1 },				
				onMenu : function()
				{
					return {
						inserColumnThree_01 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_02 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_03 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_04 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_05 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_06 : CKEDITOR.TRISTATE_OFF,
						inserColumnThree_07 : CKEDITOR.TRISTATE_OFF
					};
				}
			});
			
			//四列按钮
			editor.ui.add('qhdColumnFour', CKEDITOR.UI_MENUBUTTON,
			{
				label : '插入四列布局',
				title : '插入四列布局',
				icon  : this.path + 'images/column-4-01.gif',
				className : 'cke_button_column',
				modes : { wysiwyg : 1 },				
				onMenu : function()
				{
					return {
						inserColumnFour_01 : CKEDITOR.TRISTATE_OFF,
						inserColumnFour_02 : CKEDITOR.TRISTATE_OFF,
						inserColumnFour_03 : CKEDITOR.TRISTATE_OFF,
						inserColumnFour_04 : CKEDITOR.TRISTATE_OFF,
						inserColumnFour_05 : CKEDITOR.TRISTATE_OFF
					};
				}
			});
			
			//五列按钮
			editor.ui.add('qhdColumnFive', CKEDITOR.UI_MENUBUTTON,
			{
				label : '插入五列布局',
				title : '插入五列布局',
				icon  : this.path + 'images/column-5-01.gif',
				className : 'cke_button_column',
				modes : { wysiwyg : 1 },				
				onMenu : function()
				{
					return {
						inserColumnFive_01 : CKEDITOR.TRISTATE_OFF
					};
				}
			});		
			
			
			// 修改多列布局
			/* editor.addCommand('modifyQhdColumn',
			{
				exec : function( editor )
				{
					alert('修改多列布局!');
				}				
			}); */
			
			// 删除多列布局
			editor.addCommand('removeQhdColumn',
			{
				exec : function( editor )
				{
					//alert('删除多列布局!');
					if( getDivElementByClass(editor, 'column') != null ){
						var columnElement = getDivElementByClass(editor, 'column');
						columnElement.remove();	//删除整个多列html的内容
					}
				}				
			});
			

			/* S 右键菜单 */
			if ( editor.addMenuItems )
			{
				editor.addMenuGroup("qhdColumnTwo", 250);
				editor.addMenuGroup("modifyQhdColumn", 260);
				editor.addMenuGroup("modifyQhdColumnMarg", 270);

				editor.addMenuItems(
				{	
					/* S 修改多列的布局 */
					modifyQhdColumn :
					{
						label : '修改多列的布局',
						icon: this.path + 'column.png',
						group : 'modifyQhdColumn',
						//command: 'modifyQhdColumn',
						order : 261,
						getItems : function()
						{
							return {
								modifyQhdColumnTow   : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFour  : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFive  : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnTow :
					{
						label : '修改成两列布局',
						icon: this.path + 'images/column-2-01.gif',
						group : 'modifyQhdColumn',						
						order : 262,
						getItems : function()
						{
							return {
								modifyQhdColumnTow_01 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_02 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_03 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_04 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_05 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_06 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_07 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_08 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnTow_09 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnTow_01 :
					{
						label : '1/2 + 1/2',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-2-1,col-2-1'); }
					},
					modifyQhdColumnTow_02 :
					{
						label : '1/3 + 2/3',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-3-1,col-3-2'); }
					},
					modifyQhdColumnTow_03 :
					{
						label : '2/3 + 1/3',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-3-2,col-3-1'); }
					},
					modifyQhdColumnTow_04 :
					{
						label : '1/4 + 3/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-1,col-4-3'); }
					},
					modifyQhdColumnTow_05 :
					{
						label : '3/4 + 1/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-3,col-4-1'); }
					},
					modifyQhdColumnTow_06 :
					{
						label : '2/5 + 3/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-2,col-5-3'); }
					},
					modifyQhdColumnTow_07 :
					{
						label : ' 3/5 + 2/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-3,col-5-2'); }
					},
					modifyQhdColumnTow_08 :
					{
						label : ' 1/5 + 4/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-4'); }
					},
					modifyQhdColumnTow_09 :
					{
						label : ' 4/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-4,col-5-1'); }
					},
					
					modifyQhdColumnThree :
					{
						label : '修改成三列布局',
						icon: this.path + 'images/column-3-01.gif',
						group : 'modifyQhdColumn',						
						order : 263,
						getItems : function()
						{
							return {
								modifyQhdColumnThree_01 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_02 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_03 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_04 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_05 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_06 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnThree_07 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnThree_01 :
					{
						label : '1/3 + 1/3 + 1/3',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-3-1,col-3-1,col-3-1'); }
					},
					modifyQhdColumnThree_02 :
					{
						label : '1/4 + 1/4 + 2/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-1,col-4-1,col-4-2'); }
					},
					modifyQhdColumnThree_03 :
					{
						label : '1/4 + 2/4 + 1/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-1,col-4-2,col-4-1'); }
					},
					modifyQhdColumnThree_04 :
					{
						label : '2/4 + 1/4 + 1/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-2,col-4-1,col-4-1'); }
					},
					modifyQhdColumnThree_05 :
					{
						label : '1/5 + 1/5 + 3/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-1,col-5-3'); }
					},
					modifyQhdColumnThree_06 :
					{
						label : '1/5 + 3/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-3,col-5-1'); }
					},
					modifyQhdColumnThree_07 :
					{
						label : '3/5 + 1/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-3,col-5-1,col-5-1'); }
					},
					
					modifyQhdColumnFour :
					{
						label : '修改成四列布局',
						icon: this.path + 'images/column-4-01.gif',
						group : 'modifyQhdColumn',						
						order : 264,
						getItems : function()
						{
							return {
								modifyQhdColumnFour_01 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFour_02 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFour_03 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFour_04 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnFour_05 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnFour_01 :
					{
						label : '1/4 + 1/4 + 1/4 + 1/4',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-4-1,col-4-1,col-4-1,col-4-1'); }
					},
					modifyQhdColumnFour_02 :
					{
						label : '1/5 + 1/5 + 1/5 + 2/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-1,col-5-1,col-5-2'); }
					},
					modifyQhdColumnFour_03 :
					{
						label : '1/5 + 1/5 + 2/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-1,col-5-2,col-5-1'); }
					},
					modifyQhdColumnFour_04 :
					{
						label : '1/5 + 2/5 + 1/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-2,col-5-1,col-5-1'); }
					},
					modifyQhdColumnFour_05 :
					{
						label : '2/5 + 1/5 + 1/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-2,col-5-1,col-5-1,col-5-1'); }
					},
					
					modifyQhdColumnFive :
					{
						label : '修改成五列布局',
						icon: this.path + 'images/column-5-01.gif',
						group : 'modifyQhdColumn',						
						order : 265,
						getItems : function()
						{
							return {
								modifyQhdColumnFive_01 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnFive_01 :
					{
						label : '1/5 + 1/5 + 1/5 + 1/5 + 1/5',
						group : 'modifyQhdColumn',
						onClick : function() { modifyColumn( editor, 'col-5-1,col-5-1,col-5-1,col-5-1,col-5-1'); }
					},
					/* E 修改多列的布局 */
					
					/* S 调整多列的间距 */
					modifyQhdColumnMarg :
					{
						label : '调整多列的间距',
						icon: this.path + 'column.png',
						group : 'modifyQhdColumnMarg',	//设置组的标记
						order : 2,
						getItems : function()
						{
							return {
								modifyQhdColumnMarg_0 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnMarg_2 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnMarg_4 : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnMarg_5 : CKEDITOR.TRISTATE_OFF
							};
						}
					},
					modifyQhdColumnMarg_0 :
					{
						label : '多列的间距 - 0%',
						icon: this.path + 'removeColumn.png',
						group : 'modifyQhdColumnMarg',
						//command : 'modifyQhdColumnMarg'
						onClick : function() { modifyQhdColumnMarg( editor, 'marg-per0'); }
					},
					modifyQhdColumnMarg_2 :
					{
						label : '多列的间距 - 2%',
						icon: this.path + 'removeColumn.png',
						group : 'modifyQhdColumnMarg',
						onClick : function() { modifyQhdColumnMarg( editor, 'marg-per2'); }
					},
					modifyQhdColumnMarg_4 :
					{
						label : '多列的间距 - 4%',
						icon: this.path + 'removeColumn.png',
						group : 'modifyQhdColumnMarg',
						onClick : function() { modifyQhdColumnMarg( editor, 'marg-per4'); }
					},
					modifyQhdColumnMarg_5 :
					{
						label : '多列的间距 - 5%',
						icon: this.path + 'removeColumn.png',
						group : 'modifyQhdColumnMarg',
						onClick : function() { modifyQhdColumnMarg( editor, 'marg-per5'); }
					},
					/* E 调整多列的间距 */
					
					removeQhdColumn :
					{
						label : '删除多列的布局',
						icon: this.path + 'removeColumn.png',
						group : 'qhdColumnTwo',
						command: 'removeQhdColumn',
						order : 290
					}
				});
			}
			
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element || element.isReadOnly() )
                    	return null;
					
					while ( element )
					{	
						var name = element.getName(),
							className = element.getAttribute('class');	
							
						if (name == 'body') { break }//跳出循环
						if ( (element.is('div') && className.search(/col/i)!=-1) || (element.is('div') && element.hasClass('column') ) ){
							return {
								modifyQhdColumn     : CKEDITOR.TRISTATE_OFF,
								modifyQhdColumnMarg : CKEDITOR.TRISTATE_OFF,
								removeQhdColumn     : CKEDITOR.TRISTATE_OFF
							};
						}
						element = element.getParent();
					}
					return null;
					
				});
			}
			/* E 右键菜单 */
			
		
		}	//end of init
	});
	
})();
