/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.addTemplates('default', {
    imagesPath: CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templates') + 'templates/images/'),
    templates: [
	{
        title: '图文混编 - 文字环绕着图片',
        image: 'template1.gif',
        description: '文字环绕着图片，图片在左边的图文混编布局。',
        html: '<div class="typo"><a href="#"><img src="images/template_img/template1.gif" class="typo_img" /></a><h5>图文混排方法</h5><p>Tal基于html属性，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，就可以自动转换成动态内容只要在静态的html。</p></div>'
    },
    {
        title: '图文混编 - 文字环绕着图片',
        image: 'template2.gif',
        description: '文字环绕着图片，图片在右边的图文混编布局。',
        html: '<div class="typo"><a href="#"><img src="images/template_img/template2.gif" class="typo_img imgtoright" /></a><h5>图文混排方法</h5><p>Tal基于html属性，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，就可以自动转换成动态内容只要在静态的html。</p></div>'
    },
    {
        title: '图文混编 - 文字图片各一边',
        image: 'template3.gif',
        description: '文字图片各一边，图片在左边的图文混编布局。',
        html: '<div class="typo"><a href="#"><img class="typo_img"src="images/template_img/template3.gif"></a><div class="typo_text"><h5>图文混排方法</h5><p>Tal基于html属性，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，就可以自动转换成动态内容只要在静态的html。</p></div></div>'
    },
	{
        title: '图文混编 - 文字图片各一边',
        image: 'template4.gif',
        description: '文字图片各一边，图片在右边的图文混编布局。',
        html: '<div class="typo"><a href="#"><img class="typo_img imgtoright"src="images/template_img/template4.gif"></a><div class="typo_text"><h5>图文混排方法</h5><p>Tal基于html属性，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容只要在静态的html标记之间加入企户动的Tal属性标记，就可以自动转换成动态内容，用Dreamweaver之类的html编辑器就可以很友好地看到页面效果，就可以自动转换成动态内容只要在静态的html。</p></div></div>'
    }
	]
});