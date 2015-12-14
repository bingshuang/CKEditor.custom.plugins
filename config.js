CKEDITOR.editorConfig = function( config )
{	
	config.uiColor = '#ddd';
	config.bodyClass ='qhd-content';
	config.contentsCss = ['css/style.css', 'css/content.css'];
	
	config.toolbar = 'Cms';
    config.toolbar_Cms =
    [
		['Source'],		
		['qhdColumnTwo','qhdColumnThree','qhdColumnFour','qhdColumnFive'],
		['NumberedList','qhdList','qhdButton'],	//BulletedList
    ];	
	config.extraPlugins = 'qhdColumn,qhdList,qhdButton';	//多列、自定义列表、自定义按钮 
	
};
