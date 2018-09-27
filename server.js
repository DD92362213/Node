const http=require('http');
const fs=require('fs');
const urllib=require('url');
const querystring=require('querystring');

var users={};

var server = http.createServer(function(req,res) {

  var str = '';
  req.on('data',function(data){
    str+=data;
  });
  req.on('end',function(){
    var obj=urllib.parse(req.url,true);
    const url = obj.pathname;
    const GET = obj.query;
    const POST = querystring.parse(str);
    
    if(url=='/user'){
        switch(GET.act){
            case 'reg':
            if(users[GET.user]){
                res.write('{"ok":false,"msg":"Username is already occupied!"}');
            }else{
                users[GET.user]=GET.password;
                res.write('{"ok":true,"msg":"registration success！"}');
            }
            break;
            case 'login':
            if(users[GET.user]==null){
                res.write('{"ok":false,"msg":"User does not exist！"}');
            }else if(users[GET.user]!=GET.password){ 
                res.write('{"ok":false,"msg":"Incorrect password！"}');
            }else{
                res.write('{"ok":true,"msg":"Landed successfully！"}');
            }
            break;
            default:
            res.write('{"ok":false,"msg":"Unknown request!"}');
        }
        res.end();
    }else{
        var file_name = './www'+url;
        fs.readFile(file_name,function(err,data){
            if(err){
                res.write('404');
            }else{
                res.write(data);
            }
            res.end();
        });
    }

  });
});

server.listen(8080);
