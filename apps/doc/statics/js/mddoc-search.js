var originSearchDatas = [{"id":1,"parent_id":0,"title":"\u4ecb\u7ecd","mdFileName":"README.md","url":"index.html","level":0,"content":"\u9a7e\u6821\u7cfb\u7edf\u4e91\u8c79\u6846\u67b6\u9a7e\u6821\u89e3\u51b3\u65b9\u6848"},{"id":2,"parent_id":0,"title":"\u914d\u7f6e","mdFileName":"chapter1.md","url":"chapter1.html","level":0,"content":"\u914d\u7f6e\u9879\u4e00"},{"id":3,"parent_id":0,"title":"\u4f7f\u7528","mdFileName":"shi-yong.md","url":"shi-yong.html","level":0,"content":"\u4f7f\u7528\u8bf4\u660e"}];
var searchDatas = [];
function initSearchDatas()
{
	searchDatas = JSON.parse(JSON.stringify(originSearchDatas));
	for(var i = 0; i < searchDatas.length; ++i)
	{
		if(void 0 !== searchDatas[i].url)
		{
			searchDatas[i] = parseCatalogItem(searchDatas[i]);
		}
	}
	doSearch($('#search-keyword').val());
}

String.prototype.indexOf2 = function(f){
    var rt = this.match(eval('/' + f + '/i'));
    return (rt == null) ? -1 : rt.index;
}

function switchSearchNode(a)
{
	if ('pushState' in history)
	{
		getChapter(a.attr('href'));
		history.pushState('', '', a.attr('href'));
		$('#treeSearch a').removeClass('curSelectedNode');
		a.addClass('curSelectedNode');
	}
	else
	{
		location = treeNode.url;
	}
}

function searchArticle(keyword)
{
    var keywords = keyword.split(' ');
    var tSearchDatas = searchDatas;
    var result = [];
    keywords.forEach(function(kw){
		if('' === kw)
		{
			return;
		}
        result = [];
        tSearchDatas.forEach(function(item, index){
            if(item.content.indexOf2(kw) > -1 || item.title.indexOf2(kw) > -1)
            {
                result.push(item);
            }
        });
        tSearchDatas = result;
    });
    return result;
}

var searchTimer = null;
function parseSearch()
{
    $('#search-keyword').on('input', function(){
		if(null != searchTimer)
		{
			clearTimeout(searchTimer);
			searchTimer = null;
		}
		var inputKeyword = $(this);
		searchTimer = setTimeout(function(){
			doSearch(inputKeyword.val());
			searchTimer = null;
		}, 200);
		return false;
    });
}

function doSearch(keyword)
{
	var result = searchArticle(keyword);
	if(result.length > 0)
	{
		$('.searchResultNone').hide();
	}
	else
	{
		$('.searchResultNone').show();
	}
	var index = -1;
	$('#treeSearch a').each(function(i, item){
		++index;
		if($(item).hasClass('curSelectedNode'))
		{
			return false;
		}
	});
	layui.laytpl($('#searchListTemplate').html()).render(result, function(html){
		$('#treeSearch').html(html);
		if(index >= 0)
		{
			var node = $('#treeSearch a').get(index);
			if(null !== node)
			{
				$(node).addClass('curSelectedNode');
			}
		}
	});
}

$(function(){

	$('body').on('click', '#treeSearch a', function(e){
		switchSearchNode($(this));
		return false;
	});

	parseSearch();

})