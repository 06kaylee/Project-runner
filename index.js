#!/usr/bin/env node

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal');
const fs = require('fs');
const {spawn} = require('child_process');
const chalk = require('chalk');

//CLI tool
program
.version('0.0.1')
.argument('[filename]', 'Name of a file to execute')
.action(async ({filename}) => {
    //sets name to the argument passed or defaults to index.js
    const name = filename || 'index.js';

    //checking if the file exists
    try {
        await fs.promises.access(name);
    }
    catch(err) {
        throw new Error(`Could not find the name of the file ${name}`);
    }
    
    let proc;
    //100 ms go by before add is invoked
    const start = debounce(() => {
        //kill previous copy of program
        if(proc) {
            proc.kill();
        }
        console.log(chalk.blue.bold('>>>> Starting process...'));
        proc = spawn('node', [name], {stdio: 'inherit'});
    }, 100);
    
    
    chokidar.watch('.', {
        ignored: /node_modules/,
    })
    .on('add', start)
    .on('change', start)
    .on('unlink', start)
});

program.parse(process.argv);

