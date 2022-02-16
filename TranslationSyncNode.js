const path = require('path');
const fs = require('fs');

//Configure Which Languages will be synced
const config = {
    mainLanguage :'en', //Will be the source
	otherLanguages: ['tr', 'es', 'it'], //These languages will be synced to main language
	localesPath: './public/locales'
};

const filesDb = [];

/* Translation Logging System */
const logs = [];
const log = (fileName, message = 'Added missing translation') => {
	logs.push(`Translation File [${fileName}]: ${message}`);
};
const writeLogFile = () => {
    
    //Read old log file
    let logFileContent = fs.readFileSync('TranslationLog.log');
    //Generate new logs
    let newLog = 'Sync Translation Results - ' + new Date().toLocaleString() + "\n\n";
    if(logs.length > 0) {
	    newLog += logs.join(', \n');
    }else {
        newLog += "Files are already synced\n";
    }
    logFileContent = newLog + "\n-----------------------------------------------------\n\n" + logFileContent;

	fs.writeFileSync('TranslationLog.log', logFileContent);
};

/* PROCESS:

    1. Verify the first item in languages array exists in locales path
    2. Loop through all files in main language and create corresponding files if necessary
    3. Go through each file in main language, sync it with the other languages


*/

const exploreDir = (language) => {
	const dir = path.join(config.localesPath, language);
	const maxItems = 100; //Emergency stop
	const result = [];

    //Add a found file to result array
	const addToResult = (filename, langCode, relativePath) => {
		if (relativePath.length > 0) {
			relativePath = relativePath.replace(/^[\\/]+/, '');
			relativePath = relativePath.replace(/[\\/]+$/, '');
		}
		const entry = {
			file: path.join(dir, relativePath, filename),
			filename: filename,
			language: langCode,
			relativePath: relativePath,
		};
		result.push(entry);
	};

	if (!fs.existsSync(dir)) {
		console.log(`Path does not exist (${dir})`);
		return;
	}

	const recursiveSearch = (pathToSearch) => {
		//Emergency Break
		if (result.length > maxItems) {
			console.log('Directory Exploration - exceeded max number of results (' + maxItems + ')');
			return false;
		}
		//Find relative dir
		let relativePath = pathToSearch.replace(dir, '');
		if (relativePath.length === 0) {
			relativePath = '.';
		}

		//Load all files and folders in directory
		const items = fs.readdirSync(pathToSearch);

		//Loop through all items (Files and folders)
		for (let item of items) {
			//Generate absolute path to current item
			const pathToItem = path.join(pathToSearch, item);

			//Push item to array if its a file, recursive search if its a folder
			if (fs.statSync(pathToItem).isDirectory()) {
				//Item is folder
				if (recursiveSearch(pathToItem) === false) {
					//If this function returns false, its emergency break
					break;
				} else {
					continue;
				}
			} else {
				//This is a file not a folder. Push it to results
				addToResult(item, language, relativePath);
			}
		}
	};

	//Run the function at the dir
	recursiveSearch(dir);

	return result;
};

//Check if string is valid json
function isJsonValid(jsonString) {
	try {
		JSON.parse(jsonString);
	} catch (error) {
		return false;
	}
	return true;
}

//Sync all keys in two files
function syncJsonFile(source, target = null) {
	//verify source exists
	if (!fs.existsSync(source)) {
		throw new Error(`Missing source file: ${source}`);
	}

	//Load source file as json
	const sourceRaw = fs.readFileSync(source);
	const sourceJson = isJsonValid(sourceRaw) ? JSON.parse(sourceRaw) : {};

	//Check if target exists, if not, create it and return
	if (!fs.existsSync(target)) {
		//File doesn't exist
		fs.writeFileSync(target, JSON.stringify(sourceJson, null, 2));
		log(target, 'Added fresh translation file');
		return;
	}
	//Load target and parse
	const targetRaw = fs.readFileSync(target);
	const targetJson = isJsonValid(targetRaw) ? JSON.parse(targetRaw) : {};

	//Loop each key in source json and compare to target
	for (const prop in sourceJson) {
		//If this is object, traverse
		if (typeof sourceJson[prop] === 'object' && Array.isArray(sourceJson[prop]) === false) {
			//Check if target has this key
			if (prop in targetJson === false) {
				//Target doesn't have this prop. Clone it there
				targetJson[prop] = sourceJson[prop];
				log(target, `Added missing property - ${prop}`);
			} else {
				//Target already has this prop, merge source and target.
				//spreading target after source means, target's values will write over sources
				//It'll protect integrity of target original values
				if (Object.keys(sourceJson[prop]).length !== Object.keys(targetJson[prop]).length) {
					log(target, `Added some missing values to property: ${prop}`);
				}
				targetJson[prop] = { ...sourceJson[prop], ...targetJson[prop] };
			}
		} else {
			//This property is a basic variable or an array. Check if its missing and add it
			if (prop in targetJson === false) {
				//Missing prop in target
				targetJson[prop] = sourceJson[prop];
				log(target, `Added new property: ${prop}`);
			}
		}
	}

	//Write the result to file
	fs.writeFileSync(target, JSON.stringify(targetJson, null, '\t'));
}

//Replace language in /path/path/language/path/path/file
function findRelatedFile(relativePath, targetLanguage, filename) {
	const targetFolder = path.join(config.localesPath, targetLanguage, relativePath);
	//Check if directory exists
	if (!fs.existsSync(targetFolder) || !fs.statSync(targetFolder).isDirectory()) {
		//Missing dir, create it
		fs.mkdirSync(targetFolder, { recursive: true });
	}

	return path.join(targetFolder, filename);
}

function main() {
	//Loop through main language files and index them
	filesDb.push(...exploreDir(config.mainLanguage));

    
    
	//Loop main language files and sync
	filesDb.forEach((item) => {
        //For each main language item, loop through all other languages and sync the file
        config.otherLanguages.forEach( (targetLanguage) => {
            const relatedFile = findRelatedFile(item.relativePath, targetLanguage, item.filename );
            //Sync related file to original
            syncJsonFile(item.file, relatedFile);
            return true;
        })
    });

    //Write log file
    writeLogFile();
}

main();
