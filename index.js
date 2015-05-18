#!/usr/bin/env node

'use strict';
var spawn = require('child_process').spawn;

var sh, shFlag, children, args, cmds, verbose;

cmds = [];
args = process.argv.slice(2);
for (var i = 0, l = args.length; i < l; i++) {
    if (args[i][0] === '-') {
        switch (args[i]) {
            case '-v':
            case '--verbose':
                verbose = true;
                break;
            case '-h':
            case '--help':
                console.log('-h, --help         output usage information');
                console.log('-v, --verbose      verbose logging');
                process.exit();
                break;
        }
    } else {
        cmds.push(args[i]);
    }
}

// close parent process and all of it's running child processes
function exit (code) {
    for (var i = 0, l = children.length, child, code; i < l; i++) {
        child = children[i];
        code = child.exitCode;
        console.log('PID' + child.pid);
        if (code !== null) {
            if (verbose) {
                console.log('`' + child.cmd + '` exited with code ' + code);
            }
        } else {
            closeChild(child);
        }
    }

    if (verbose) {
        console.log('Parent process will now be closed');
    }

    process.removeAllListeners('SIGINT');
    process.exit(code);
}

function closeChild (child) {
    if (verbose) {
        console.log('Child process `' + child.cmd + '` will now be closed');
    }

    child.removeAllListeners('close');
    child.removeAllListeners('exit');
    child.kill();
    process.kill(child.pid, 'SIGINT');
}

// cross platform compatibility
if (process.platform === 'win32') {
    sh = 'cmd';
    shFlag = '/c';
} else {
    sh = 'sh';
    shFlag = '-c';
}

// start child processes
children = [];
cmds.forEach(function (cmd) {
    if (verbose) {
        console.log('Starting child process `' + cmd + '`');
    }

    var child = spawn(sh, [ shFlag , cmd ], {
        cwd: process.cwd,
        env: process.env,
        stdio: [ 'pipe', process.stdout, process.stderr ],
        detached: true
    })
    .on('error', exit)
    .on('exit', exit);
    child.cmd = cmd;
    children.push(child);
});

// close all children on CTRL + C
process.on('SIGINT', exit);