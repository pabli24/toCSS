'use strict';
/*global LZString, StylusRenderer, less, usercssMeta, documentPictureInPicture*/

import ace from 'ace-builds/src-noconflict/ace.js';
// import 'ace-builds/esm-resolver';

import 'ace-builds/src-noconflict/ext-language_tools.js';
import 'ace-builds/src-noconflict/ext-settings_menu.js';
import 'ace-builds/src-noconflict/ext-searchbox.js';
import 'ace-builds/src-noconflict/ext-keybinding_menu.js';
import 'ace-builds/src-noconflict/ext-prompt.js';

import 'ace-builds/src-noconflict/snippets/css.js';

import 'ace-builds/src-noconflict/mode-json5.js';
import 'ace-builds/src-noconflict/mode-css.js';
import 'ace-builds/src-noconflict/mode-stylus.js';
import 'ace-builds/src-noconflict/mode-less.js';
import 'ace-builds/src-noconflict/mode-sass.js';
import 'ace-builds/src-noconflict/mode-scss.js';

import 'ace-builds/src-noconflict/keybinding-emacs.js';
import 'ace-builds/src-noconflict/keybinding-sublime.js';
import 'ace-builds/src-noconflict/keybinding-vim.js';
import 'ace-builds/src-noconflict/keybinding-vscode.js';

import 'ace-builds/src-noconflict/theme-ambiance.js';
import 'ace-builds/src-noconflict/theme-chaos.js';
import 'ace-builds/src-noconflict/theme-chrome.js';
import 'ace-builds/src-noconflict/theme-cloud_editor_dark.js';
import 'ace-builds/src-noconflict/theme-cloud_editor.js';
import 'ace-builds/src-noconflict/theme-cloud9_day.js';
import 'ace-builds/src-noconflict/theme-cloud9_night.js';
import 'ace-builds/src-noconflict/theme-cloud9_night_low_color.js';
import 'ace-builds/src-noconflict/theme-clouds.js';
import 'ace-builds/src-noconflict/theme-clouds_midnight.js';
import 'ace-builds/src-noconflict/theme-cobalt.js';
import 'ace-builds/src-noconflict/theme-crimson_editor.js';
import 'ace-builds/src-noconflict/theme-dawn.js';
import 'ace-builds/src-noconflict/theme-dracula.js';
import 'ace-builds/src-noconflict/theme-dreamweaver.js';
import 'ace-builds/src-noconflict/theme-eclipse.js';
import 'ace-builds/src-noconflict/theme-github.js';
import 'ace-builds/src-noconflict/theme-github_dark.js';
import 'ace-builds/src-noconflict/theme-gob.js';
import 'ace-builds/src-noconflict/theme-gruvbox.js';
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard.js';
import 'ace-builds/src-noconflict/theme-gruvbox_light_hard.js';
import 'ace-builds/src-noconflict/theme-idle_fingers.js';
import 'ace-builds/src-noconflict/theme-iplastic.js';
import 'ace-builds/src-noconflict/theme-katzenmilch.js';
import 'ace-builds/src-noconflict/theme-kr_theme.js';
import 'ace-builds/src-noconflict/theme-kuroir.js';
import 'ace-builds/src-noconflict/theme-merbivore.js';
import 'ace-builds/src-noconflict/theme-merbivore_soft.js';
import 'ace-builds/src-noconflict/theme-mono_industrial.js';
import 'ace-builds/src-noconflict/theme-monokai.js';
import 'ace-builds/src-noconflict/theme-nord_dark.js';
import 'ace-builds/src-noconflict/theme-one_dark.js';
import 'ace-builds/src-noconflict/theme-pastel_on_dark.js';
import 'ace-builds/src-noconflict/theme-solarized_dark.js';
import 'ace-builds/src-noconflict/theme-solarized_light.js';
import 'ace-builds/src-noconflict/theme-sqlserver.js';
import 'ace-builds/src-noconflict/theme-terminal.js';
import 'ace-builds/src-noconflict/theme-textmate.js';
import 'ace-builds/src-noconflict/theme-tomorrow.js';
import 'ace-builds/src-noconflict/theme-tomorrow_night.js';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue.js';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright.js';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties.js';
import 'ace-builds/src-noconflict/theme-twilight.js';
import 'ace-builds/src-noconflict/theme-vibrant_ink.js';
import 'ace-builds/src-noconflict/theme-xcode.js';

import './ext-statusbar2.js';

import * as sass from 'sass';

let aceEditorSetting = {
	theme: 'ace/theme/tomorrow_night_bright',
	mode: 'ace/mode/css',
	fontSize: 16,
	wrap: true,
	printMargin: false,
	useSoftTabs: false,
	tabSize: 4,
	cursorStyle: 'smooth',
	keyboardHandler: 'ace/keyboard/vscode',
	enableBasicAutocompletion: true,
	enableLiveAutocompletion: true,
	autoScrollEditorIntoView: true,
	scrollPastEnd: 1,
	customScrollbar: true,
	animatedScroll: true,
	useSvgGutterIcons: true,
	showFoldedAnnotations: true,
	fadeFoldWidgets: true,
	enableSnippets: true,
	useWorker: true
};

let editor = ace.edit('input-editor', aceEditorSetting);
let editor2 = ace.edit('output-editor', aceEditorSetting);
editor2.setOptions({
	readOnly: true
});

if (localStorage.getItem('options')) {
	loadOptions();
}

ace.require('ace/ext/settings_menu').init(editor);
editor.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(a) {
		a.showSettingsMenu();
		customOptions();
	},
	readOnly: true
}]);

ace.require('ace/ext/settings_menu').init(editor2);
editor2.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(editor2) {
		editor2.showSettingsMenu();
		customOptions();
	},
	readOnly: true
}]);

const settings = document.getElementById('settings');

settings.onclick = () => {
	editor.showSettingsMenu();
	customOptions();
};

const settings2 = document.getElementById('settings2');

settings2.onclick = () => {
	editor2.showSettingsMenu();
	customOptions();
};

let inputStatusbar = document.getElementById('input-statusbar');
let outputStatusbar = document.getElementById('output-statusbar');
let statusBar = ace.require('ace/ext/statusbar2').StatusBar;

new statusBar(editor, inputStatusbar);
new statusBar(editor2, outputStatusbar);

let url = new URL(location);
let params = url.searchParams;
let paramCode = params.get('code');
let paramC = params.get('c');

let preprocessor = document.getElementById('container').getAttribute('preprocessor');

if (paramCode !== null) {
	editor.session.setValue(paramCode);
}
else if (paramC !== null) {
	paramC = LZString.decompressFromEncodedURIComponent(paramC);
	editor.session.setValue(paramC);
}
else if (localStorage.getItem('codeStylus') !== null && preprocessor === 'stylus') {
	editor.session.setValue(localStorage.getItem('codeStylus'));
}
else if (localStorage.getItem('codeLess') !== null && preprocessor === 'less') {
	editor.session.setValue(localStorage.getItem('codeLess'));
}
else if (localStorage.getItem('codeScss') !== null && preprocessor === 'scss') {
	editor.session.setValue(localStorage.getItem('codeScss'));
}
else if (localStorage.getItem('codeSass') !== null && preprocessor === 'sass') {
	editor.session.setValue(localStorage.getItem('codeSass'));
}
else if (localStorage.getItem('codeUsercss') !== null && preprocessor === 'usercss') {
	editor.session.setValue(localStorage.getItem('codeUsercss'));
}

//* lang
function editorMode(mode) {
	editor.session.setMode(mode);
}

if (preprocessor === 'stylus') {
	editorMode('ace/mode/stylus');

	let update = () => {
		new StylusRenderer(editor.getValue()).render((err, code) => {
			if (err) {
				editor2.session.setValue(String(err));
			} else {
				editor2.session.setValue(code);
			}
		});
		localStorage.setItem('codeStylus', editor.getValue());
	};

	update();
	editor.session.on('change', () => update());
	deleteSearchParamsOnChange();
}
else if (preprocessor === 'less') {
	editorMode('ace/mode/less');
	lessVersion();

	let update = () => {
		less.render(editor.getValue()).then((code) => {
			editor2.session.setValue(code.css);
		},
		(err) => {
			editor2.session.setValue(String(err));
		});
		localStorage.setItem('codeLess', editor.getValue());
	};

	update();
	editor.session.on('change', () => update());
	deleteSearchParamsOnChange();
}
else if (preprocessor === 'scss') {
	editorMode('ace/mode/scss');
	sassVersion();

	let update = () => {
		let code = editor.getValue();
		try {
			let scss = sass.compileString(code, {syntax: 'scss'});
			editor2.session.setValue(scss.css);
		} catch (err) {
			editor2.session.setValue(String(err));
		}
		localStorage.setItem('codeScss', editor.getValue());
	};

	update();
	editor.session.on('change', () => update());
	deleteSearchParamsOnChange();
}
else if (preprocessor === 'sass') {
	sassVersion();
	editorMode('ace/mode/sass');

	let update = () => {
		let code = editor.getValue();
		try {
			let sassCode = sass.compileString(code, {syntax: 'indented'});
			editor2.session.setValue(sassCode.css);
		} catch (err) {
			editor2.session.setValue(String(err));
		}
		localStorage.setItem('codeSass', editor.getValue());
	};

	update();
	editor.session.on('change', () => update());
	deleteSearchParamsOnChange();
}
else if (preprocessor === 'usercss') {
	editorMode('ace/mode/less');
	editor2.session.setMode('ace/mode/json5');

	let update = () => {
		let code = editor.getValue();
		try {
			let metadata = usercssMeta.parse(code);
			let jsonUserCss = JSON.stringify(metadata, null, '\t');
			editor2.session.setValue(jsonUserCss);
		} catch (err) {
			editor2.session.setValue(String(err));
		}
		localStorage.setItem('codeUsercss', code);
	};

	update();
	editor.session.on('change', () => update());
	deleteSearchParamsOnChange();
}

function deleteSearchParamsOnChange() {
	editor.session.on('change', () => {
		url.searchParams.delete('c');
		history.pushState({}, '', url);
	});
}

function lessVersion() {
	const version = less.version.join('.');
	document.getElementById('version').innerText += ' v' +  version;
}

function sassVersion() {
	const version = sass.info.split('\t')[1];
	document.getElementById('version').innerText += ' v' +  version;
}

//* length
let lengthStatusBar = document.getElementById('length');
let lengthStatusBar2 = document.getElementById('length2');

function codeLength(e) {
	e = new TextEncoder().encode(e.getValue()).length;
	return new Intl.NumberFormat().format(e);
}

function updateLengthStatusBar() {
	lengthStatusBar.innerHTML = codeLength(editor);
	lengthStatusBar2.innerHTML = codeLength(editor2);
}

updateLengthStatusBar();
editor.session.on('change', () => updateLengthStatusBar());
editor2.session.on('change', () => updateLengthStatusBar());

//* share
let share = document.getElementById('share');

share.onclick = () => {
	let decodeurl = LZString.compressToEncodedURIComponent(editor.getValue());
	url.searchParams.set('c', decodeurl);
	history.pushState({}, '', url);
	navigator.clipboard.writeText(url);
};

//* save
const downloadToFile = (content, filename, contentType) => {
	const a = document.createElement('a');
	const file = new Blob([content], {type: contentType});
	a.href= URL.createObjectURL(file);
	a.download = filename;
	a.click();
	URL.revokeObjectURL(a.href);
};

let fileExtension;
switch(preprocessor) {
	case 'stylus': 
		fileExtension = 'styl';
		break;
	case 'usercss':
		fileExtension = 'user.css';
		break;
	default:
		fileExtension = preprocessor;
}

let saveInput = () => downloadToFile(editor.getValue(), 'style.' + fileExtension, 'text/plain;charset=UTF-8');
document.getElementById('save').addEventListener('click', () => saveInput());

editor.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveInput(),
	readOnly: true
}]);

let saveOutput = () => downloadToFile(editor2.getValue(), 'style.css', 'text/plain;charset=UTF-8');
document.getElementById('save2').addEventListener('click', () => saveOutput());

editor2.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveOutput(),
	readOnly: true
}]);

//* open in popup
const popup = document.getElementById('popup');

popup.onclick = () => window.open(window.location, 'mozillaWindow', 'popup');

const isInStandaloneMode = (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || (window.navigator.windowControlsOverlay && window.navigator.windowControlsOverlay.visible) || document.referrer.includes('android-app://');

if (!window.opener && !isInStandaloneMode) {
	popup.classList.remove('hide');
}

//* resizer
const leftEditor = document.getElementById('input');
const rightEditor = document.getElementById('output');
const resizeHandle = document.getElementById('resizer');
let rw;

if (localStorage.getItem('resize') !== null) {
	rw = localStorage.getItem('resize');
	leftEditor.style.width = 100 - rw + '%';
	rightEditor.style.width = rw + '%';
}

function initialiseResize() {
	window.addEventListener('mousemove', startResizing, false);
	window.addEventListener('mouseup', stopResizing, false);
}

function startResizing(e) {
	let size = (window.innerWidth - e.clientX ) / window.innerWidth * 100;

	if (size > 99.8) size = 100;
	if (size < 0.2) size = 0;

	rw = size;
	leftEditor.style.width = 100 - rw + '%';
	rightEditor.style.width = rw + '%';
}

function stopResizing() {
	window.removeEventListener('mousemove', startResizing, false);
	window.removeEventListener('mouseup', stopResizing, false);

	editor.resize();
	editor2.resize();

	localStorage.setItem('resize', rw);
}

resizeHandle.addEventListener('mousedown', initialiseResize, false);

resizeHandle.addEventListener('dblclick', () => {
	rightEditor.style.width = '';
	leftEditor.style.width = '';

	editor.resize();
	editor2.resize();

	window.localStorage.removeItem('resize');
});

//* Save Settings
function saveOptions() {
	let options = editor.getOptions();
	let options2 = editor2.getOptions();

	localStorage.setItem('options', JSON.stringify(options));
	localStorage.setItem('options2', JSON.stringify(options2));
}

function resetOptions() {
	localStorage.removeItem('options');
	localStorage.removeItem('options2');
}

function loadOptions() {
	let rawOptions = localStorage.getItem('options');
	let rawOptions2 = localStorage.getItem('options2');

	let options = JSON.parse(rawOptions);
	let options2 = JSON.parse(rawOptions2);

	editor.setOptions(options);
	editor2.setOptions(options2);
}

function customOptions() {
	let settingsMode = document.querySelector('#controls > tr:first-child');
	settingsMode.classList.add('hide');

	let settingsMenu = document.getElementById('controls');
	let settingsMenuBtns = document.querySelectorAll('#controls button');

	settingsMenu.addEventListener('change', saveOptions);
	settingsMenuBtns.forEach((button) => {
		button.addEventListener('click', saveOptions);
	});

	let button = document.createElement('button');

	button.innerHTML = 'Default settings';
	button.title = 'Restore default settings for input and output editors';

	button.addEventListener('click', () => {
		resetOptions();
		location.reload();
	});

	settingsMenu.appendChild(button);
}