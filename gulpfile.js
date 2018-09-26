var gulp =require("gulp")
var run = require('gulp-run');
var path = require('path');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
var runSequence = require('run-sequence');
var config = require('./package.json')
gulp.task("build-backend",function(){
    return gulp.src("backend/**/*").pipe(gulp.dest("dist/"))
})
gulp.task("build-fontend",function(){
    return run('npm run  build ',{cwd:path.resolve("./","fontend"),verbosity:3}).exec()
})
gulp.task('tar', () =>
    gulp.src('dist/*')
        .pipe(tar(`simple-process-monitor-${config.version}.tar`))
        .pipe(gulp.dest('./'))
);
gulp.task("clean",()=>{
    run("rm -r dist").exec()
})
gulp.task("build",()=>{
    runSequence("clean","build-fontend","build-backend","tar")
})