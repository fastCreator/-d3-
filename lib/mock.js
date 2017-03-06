var fs =require('fs');
var Mock = require('mockjs');
var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1
    }]
});

module.exports=function(req,res,filePath,next){
    var json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    var mock=json.api[0].mock;
    var data=Mock.mock(mock);
    res.end(JSON.stringify(data));
};