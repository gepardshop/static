<?php
    $JSONRPC = '{"title":"title","tag":"tag","desc":"desc"}';
    $writetoken = '4eb2be96-fed2-4728-a94d-d8b62ca36670';
    $secretkey = 'dO3eMfJ1Nq';
    $cataid = '1';
    $hash = sha1('cataid='.$cataid.'&JSONRPC='.$JSONRPC.'&writetoken='.$writetoken.$secretkey);
    //加上sign参数一起提交post
?>
<link rel="stylesheet" type="text/css" href="uploadify.css">
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery.uploadify.min.js"></script>
<script type="text/javascript">
$(function() {
    $.fileupload1 = $('#fileupload1').uploadify({
        'auto': false,
        'formData': {
            'fcharset': 'ISO-8859-1',
            'writetoken': '4eb2be96-fed2-4728-a94d-d8b62ca36670',
            'cataid': '1',
            'JSONRPC': '{"title":"title","tag":"tag","desc":"desc"}',
            'sign':'<?php echo $hash; ?>'
        },
        'buttonText': '选择上传文件',
        'fileSizeLimit': '3000MB',
        'fileTypeDesc': '视频文件',
        'fileTypeExts': '*.avi; *.wmv; *.mp4;*.mp3; *.mov; *.flv; *.mkv; *.rmvb', //文件类型过滤
        'swf': 'uploadify.swf',
        'multi': true,
        'successTimeout': 1800,
        'queueSizeLimit': 100,
        'uploader': 'http://v.polyv.net/uc/services/rest?method=uploadfile',
        //onUploadSuccess为上传完视频之后回调的方法，视频json数据data返回，
        //下面的例子演示如何获取到vid
        'onUploadSuccess': function(file, data, response) {
            var jsonobj = eval('(' + data + ')');
            alert(jsonobj.data[0].vid + " - " + jsonobj.data[0].playerwidth + " - " + jsonobj.data[0].duration);
        }
    });
});
</script>
<p>
    <input type="file" value="Filedata" id="fileupload1">
    <input type="button" onclick="javascript:$('#fileupload1').uploadify('upload','*')" value="submit">
</p>

