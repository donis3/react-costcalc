//Load module
const syncTranslation = require('sync-translation-files');

//Configure and run
syncTranslation
	.editConfig({
		mainLanguage: 'en',
		root: ['public', 'locales'],
		languages: ['tr'],
	})
	.run();
