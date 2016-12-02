var view_config = require('./init.config.js');

// 初始化文件
var path = require('path');
var fs = require('fs');

var mkdirdeep = (path) => {
    var dirname = path.split('/');
    var active_path = '';
    dirname.forEach((dir, i) => {
        active_path += dir + '/';
        if (!fs.existsSync(active_path)) {
            fs.mkdirSync(active_path);
            console.log(active_path + '创建成功！');
        } else {
            console.log(dir + '已存在！');
        }
    });
};

var _rn = '\r\n';


// 创建文件夹阶段
mkdirdeep('src/js');
mkdirdeep('src/scss');
mkdirdeep('src/font');
mkdirdeep('src/img');
mkdirdeep('src/view');

// 生成相关文件
var entry = (view_config) => {
    var create_component = (opts) => {

        mkdirdeep('src/components/' + opts.name + '/');

        var file_path_noext = 'src/components/' + opts.name + '/' + opts.name;

        if (!fs.existsSync(file_path_noext + '.html')) {
            fs.writeFileSync(file_path_noext + '.html', '<!--'+opts.name+'组件的html-->');
        }

        if (!fs.existsSync(file_path_noext + '.scss')) {
            fs.writeFileSync(file_path_noext + '.scss', '//'+opts.name+'组件的scss');
        }

        var js_str = 'module.exports = function(){' + _rn + '   // 写'+opts.name+'组件的js代码' +_rn+ '}';

        if (!fs.existsSync(file_path_noext + '.js')) {
            fs.writeFileSync(file_path_noext + '.js', js_str);
        }
    }
    // 创建html文件及内容
    var create_html = (opts) => {
        var com_str = _rn;
        view_config[opts.name].components.forEach(name => {
            // 引入组件文件
            com_str += '    ${require(\'../components/' + name + '/' + name + '.html\')}' + _rn;
            // 生成组件文件
            create_component({ name: name });
        });

        var str = '<!DOCTYPE html>' + _rn +
            '<html>' + _rn +
            '<meta charset="utf-8" />' + _rn +
            '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />' + _rn +
            '<meta name="renderer" content="webkit" />' + _rn +
            '<meta name="description" content="描述" />'+ _rn +
            '<meta name="keyword" content="关键词" />'+ _rn +
            '<head>' + _rn +
            '   <meta charset="UTF-8">' + _rn +
            '   <title>' + opts.name + '</title>' + _rn +
            '</head>' + _rn +
            '<body>' +
            com_str +
            '   <script src="http://libs.baidu.com/jquery/1.11.1/jquery.js"></script>'+ _rn +
            '</body>' + _rn +
            '</html>';
        // if (!fs.existsSync('./src/view/' + opts.name + '.html')) {
            fs.writeFileSync('./src/view/' + opts.name + '.html', str);
        // }
    }

    var create_css = (opts) => {
        var com_str = '';
        // 引入组件scss
        view_config[opts.name].components.forEach(name => {
            com_str += '@import "../components/' + name + '/' + name + '.scss";' + _rn
        });
        // if (!fs.existsSync('./src/scss/' + opts.name + '.scss')) {
            fs.writeFileSync('./src/scss/' + opts.name + '.scss', com_str);
        // }
    }

    var create_js = (opts) => {
        // 引入入口scss
        var com_str = 'require(\'../scss/' + opts.name + '.scss\');' + _rn;
        // 引入组件js
        view_config[opts.name].components.forEach(name => {
            com_str += 'require(\'../components/' + name + '/' + name + '.js\')();' + _rn;
        });
        // if (!fs.existsSync('./src/js/' + opts.name + '.js')) {
            fs.writeFileSync('./src/js/' + opts.name + '.js', com_str);
        // }
    }

    // 生成文件
    // 遍历所有入口
    Object.keys(view_config).forEach(key => {
        // 创建入口文件
        create_html({ name: key });
        create_css({ name: key });
        create_js({ name: key });
    });

}

entry(view_config);