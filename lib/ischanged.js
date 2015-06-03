(function() {
    'use strict';
    
    var fs              = require('fs'),
        os              = require('os'),
        
        check           = require('checkup'),
        tryCatch        = require('try-catch'),
        tryrequire      = require('tryrequire'),
        time            = require('timem'),
        mkdir           = require('mkdirp'),
        
        WIN             = process.platform === 'win32',
        
        Times           = {},
        
        TimesReaded,
        
        DIR             = getDir() || __dirname + '/../json/',
        NAME_SHORT      = DIR           + 'changes',
        NAME            = NAME_SHORT    + '.json';
    
    function getTimes(callback) {
        if (TimesReaded)
            callback(Times);
        else
            makeDir(DIR, function(error) {
                if (!error)
                    Times = tryrequire(NAME_SHORT) || {};
                
                TimesReaded = true;
                
                callback(Times);
            });
    }
    
    function getDir() {
        var dir,
            sign    = '/';
        
        if (os.tmpdir) {
            dir     = os.tmpdir();
            dir     += '/ischanged';
            
            if (!WIN)
                dir += sign + process.getuid();
            
            dir     += '/';
        }
        
        return dir;
    }
    
    function makeDir(dir, callback) {
        var ANY_MASK    = 0,
            umask       = process.umask(ANY_MASK);
        
        mkdir(dir, function(error) {
            process.umask(umask);
            
            if (error && error.code === 'EEXIST')
                callback();
            else
                callback(error);
        });
    }
    
    module.exports = function(name, callback) {
        check(arguments, ['name', 'callback']);
        
        getTimes(function(times) {
            var readTime = times[name];
            
            time(name, 'raw', function(error, fileTime) {
                var json, timeChanged;
                
                if (!error && readTime !== fileTime) {
                    timeChanged     = true;
                    Times[name]     = fileTime;
                    
                    error = tryCatch(function() {
                        json = JSON.stringify(Times);
                    });
                    
                    if (!error)
                        fs.writeFile(NAME, json, function(error) {
                            if (error)
                                console.log(error);
                        });
                }
            
                callback(error, timeChanged);
            });
        });
    };
})();
