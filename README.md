# CKEditor.custom.plugins
基于CKEditor编辑器开发的插件，主要包括的插件有：
- 多列  （plugins/qhdColumn）
- 按钮  （plugins/qhdButton）
- 列表  （plugins/qhdList）

**说明**
- CKEditor 是3.6.5版本

### 安装
**1、HTML**
``` html
<div id="preContent">
	<textarea id="editor1" name="editor1">
    	<div class="test">
        	<p>Ckeditor的初始化内容，作为textarea的value值.</p>
        </div>
        <p>这里是静态html编辑区域</p>		
    </textarea>
    <input type="button" value="获取Ckeditor的html内容" onclick="GetContents();">
</div>
```

**2、javascript**
``` javascript
<script language="javascript" src="ckeditor.js"></script>
```

**3、配置config.js**
``` javascript
CKEDITOR.editorConfig = function( config )
{	
	config.uiColor = '#ddd';
	config.bodyClass ='qhd-content';	//为body添加外层控制样式Class
	config.contentsCss = ['css/style.css', 'css/content.css'];	//引入css，其中content.css是必须有
	config.toolbar = 'Cms';
    config.toolbar_Cms =
    [
		['Source'],	
		['qhdColumnTwo','qhdColumnThree','qhdColumnFour','qhdColumnFive'],//配置工具栏
		['NumberedList','qhdList','qhdButton'],
    ];	
	config.extraPlugins = 'qhdColumn,qhdList,qhdButton';	//引入插件
};

```

### License
MIT	

