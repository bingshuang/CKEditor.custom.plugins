(function()
{
	//获取企互动静态html编辑的div区域
	function getQhdContent(editor)
	{
		var element = editor.getSelection().getStartElement();	//获取当前光标所在位置的第一个标签
		
		while ( element ){
			var name = element.getName();
			//alert(element);
			if (name == 'body') { break }//跳出循环
			if ( name == 'div' && element.hasClass('qhd-content') ){
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
	
	//获取按钮（a）标签
	function getA( editor )
	{
		var element = editor.getSelection().getStartElement();	//获取当前光标所在位置的第一个标签
		
		while ( element ){
			var name = element.getName(),
				className = element.getAttribute('class')
				;
				
			if ( name == 'a' && className.search(/btn/i) !=-1 ){
				return element;
			}
			element = element.getParent();
		}
		return null;
	}
	
	
	
	/* -----------------------------------------------------------------------------*/
	
	CKEDITOR.plugins.qhdButton =
	{
		requires : [ 'iframedialog' ],
		init : function( editor )
		{
			//插件名称
	     	var pluginName = 'qhdButton';
			
			//工具栏按钮
			editor.ui.addButton('qhdButton',  
			{                 
				label: '插入/编辑按钮',				
				icon: this.path + 'qhdButton.gif',
				command: pluginName		//按钮执行的事件
			});
			
			CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/qhdButton.js' );
			editor.addCommand(pluginName, new CKEDITOR.dialogCommand( 'qhdButton' ) );
			editor.addCommand('removeQhdButton',
			{
				exec : function( editor )
				{
					var aElement = getA( editor ),
						oldText = aElement.getText();
						//oldHtml = aElement.getHtml();
						
					if(aElement){
						aElement.remove();	//删除整个标签块的内容
						editor.insertHtml(oldText);	//插入原来的内容	
					}
				}				
			});
			
			// Open our dialog on double click
			editor.on( 'doubleclick', function( e )
			{				
				var buttonElement = e.data.element;
				
				if(  buttonElement )
				{					
					if( buttonElement.is( 'span' ) )
					{						
						buttonElement = buttonElement.getParent();	//如果当前标签是span，取父级标签 
					}
					
					var className = buttonElement.getAttribute('class');				
					if( buttonElement.is( 'a' ) && className != null && className.search(/btn/i) != -1 ){					
						e.data.dialog = 'qhdButton';
						e.cancel();	//要不要貌似没有什么影响
					}
				}				
			}); 
			
			/* S 处理右键上下文菜单 */
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				//Register qhdList group;
				editor.addMenuGroup("qhdButton", 2100);

				editor.addMenuItems(
				{						
					qhdButton :
					{
						label : '修改按钮',												
						command: 'qhdButton',
						group : 'qhdButton',
						icon: this.path + 'qhdButton.gif',
						order : 1
					},
					removeQhdButton :
					{
						label : '删除按钮',
						command: 'removeQhdButton',
						group : 'qhdButton',
						icon: this.path + 'removeQhdButton.gif',						
						order : 1
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
						var className = element.getAttribute('class');
						
						if ( element.is('a') && className != null && className.search(/btn/i) != -1 ){
							editor.contextMenu.removeAll();	//删除所有的上下文菜单
							return {
								qhdButton : CKEDITOR.TRISTATE_OFF,
								removeQhdButton : CKEDITOR.TRISTATE_OFF
							};							
						}
						element = element.getParent();
					}
					return null;
					
				});
			}			
			/* E 处理右键上下文菜单 */
			
			
			/* S 设置按钮的当前状态 */
			editor.on( 'selectionChange', function( e )
			{
				
			});
			/* E 设置按钮的当前状态 */
			
		}
	};

	CKEDITOR.plugins.add( 'qhdButton', CKEDITOR.plugins.qhdButton );
	
})();
