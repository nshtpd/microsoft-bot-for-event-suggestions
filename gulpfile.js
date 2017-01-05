var gulp = require('gulp');
var sequence = require('run-sequence');
var server = require('gulp-express');


gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
    gulp.watch(['app.js'], [server.run]);
});

gulp.task('default',function(){
	sequence('server');
})