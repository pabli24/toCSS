'use strict'

//* ace editor settings
let setting = {
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
	showFoldedAnnotations: true
}
let editor = ace.edit('editor', setting)
let editor2 = ace.edit('editor2', setting)
if (localStorage.getItem('options')) {
	loadOptions()
}

ace.require('ace/ext/settings_menu').init(editor)
editor.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(editor) {
		editor.showSettingsMenu()
		customOptions()
	},
	readOnly: true
}])
ace.require('ace/ext/settings_menu').init(editor2)
editor2.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(editor2) {
		editor2.showSettingsMenu()
		customOptions()
	},
	readOnly: true
}])
const settings = document.getElementById('settings')
settings.onclick = () => {
	editor.showSettingsMenu()
	customOptions()
}
const settings2 = document.getElementById('settings2')
settings2.onclick = () => {
	editor2.showSettingsMenu()
	customOptions()
}
let statusBar = ace.require('ace/ext/statusbar').StatusBar;
let sb = new statusBar(editor, document.getElementById('statusBar'))
let sb2 = new statusBar(editor2, document.getElementById('statusBar2'))

let pp = document.getElementById('container')

let url = new URL(location);
let params = url.searchParams
let paramCode = params.get('code')
let paramC = params.get('c')
// let params = new URLSearchParams(document.location.search);

if (paramCode !== null) {
	editor.session.setValue(paramCode)
}
else if (paramC !== null) {
	paramC = LZString.decompressFromEncodedURIComponent(paramC)
	editor.session.setValue(paramC)
}
else if (localStorage.getItem('codeStylus') !== null && pp.hasAttribute('stylus')) {
	editor.session.setValue(localStorage.getItem('codeStylus'))
}
else if (localStorage.getItem('codeLess') !== null && pp.hasAttribute('less')) {
	editor.session.setValue(localStorage.getItem('codeLess'))
}
else if (localStorage.getItem('codeUsercss') !== null && pp.hasAttribute('usercss')) {
	editor.session.setValue(localStorage.getItem('codeUsercss'))
}
//* length
let lgth = document.getElementById('length')
let lgth2 = document.getElementById('length2')
const codeL = e => {
	e = new TextEncoder().encode(e.getValue()).length
	return new Intl.NumberFormat().format(e)
}
let editorL = () => {
	lgth.innerHTML = codeL(editor)
	lgth2.innerHTML = codeL(editor2)
}


editor.commands.addCommands([{
	name: 'colorPickerOn',
	bindKey: {win: 'Ctrl-Alt-p', mac: 'Ctrl-Alt-p'},
	exec: () => localStorage.setItem('colorPicker', '1'),
	readOnly: true
}])
editor.commands.addCommands([{
	name: 'colorPickerOff',
	bindKey: {win: 'Ctrl-Alt-[', mac: 'Ctrl-Alt-['},
	exec: () => localStorage.removeItem('colorPicker'),
	readOnly: true
}])
let editorMode = (mode) => {
	editor.session.setMode(mode, () => {
		if (localStorage.getItem('colorPicker') === '1') {
			AceColorPicker.load(ace, editor)
		}
	})
}
//* lang
if (pp.hasAttribute('stylus')) {
	editorMode('ace/mode/stylus')
	let update = () => {
		new StylusRenderer(editor.getValue()).render((err, code) => {
			if (err) {
				editor2.session.setValue(String(err));
			} else {
				editor2.session.setValue(code);
			}
		})
		localStorage.setItem('codeStylus', editor.getValue())
	}
	update()
	editor.session.on('change', () => {update(); url.searchParams.delete("c")
	history.pushState({}, "", url)})
}
else if (pp.hasAttribute('less')) {
	editorMode('ace/mode/less')
	let update = () => {
		less.render(editor.getValue()).then((code) => {
			editor2.session.setValue(code.css)
		},
		(err) => {
			editor2.session.setValue(String(err))
		})
		localStorage.setItem('codeLess', editor.getValue())
	}
	update()
	editor.session.on('change', () => update())
}
else if (pp.hasAttribute('usercss')) {
	editorMode('ace/mode/less')
	editor2.session.setMode('ace/mode/json5')
	//const usercssMeta = require('usercss-meta');
	let update = () => {
		let usercss = usercssMeta.parse(editor.getValue())
		editor2.session.setValue(JSON.stringify(usercss, null, '\t'))
		//usercssMeta.parse(editor.getValue()).then((code))
		localStorage.setItem('codeUsercss', editor.getValue())
	}
	update()
	editor.session.on('change', () => update())
}
//* size
editorL()
editor.session.on('change', () => editorL())
editor2.session.on('change', () => editorL())

//* share
let share = document.getElementById('share')
share.onclick = () => {
	let decodeurl = LZString.compressToEncodedURIComponent(editor.getValue());
	url.searchParams.set("c", decodeurl);
	history.pushState({}, "", url);
	navigator.clipboard.writeText(url)
}

//* save
const downloadToFile = (content, filename, contentType) => {
	const a = document.createElement('a')
	const file = new Blob([content], {type: contentType})
	a.href= URL.createObjectURL(file)
	a.download = filename
	a.click()
	URL.revokeObjectURL(a.href)
}
let extension = 'styl'
if (pp.hasAttribute('less')) {extension = 'less'}
else if (pp.hasAttribute('usercss')) {extension = 'user.css'}

let saveInput = () => downloadToFile(editor.getValue(), 'style.' + extension, 'text/plain;charset=UTF-8')
document.getElementById('save').addEventListener('click', () => saveInput())

editor.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveInput(),
	readOnly: true
}])

let saveOutput = () => downloadToFile(editor2.getValue(), 'style.css', 'text/plain;charset=UTF-8')
document.getElementById('save2').addEventListener('click', () => saveOutput())

editor2.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveOutput(),
	readOnly: true
}])

//* open in popup
const popup = document.getElementById('popup')
const pip = document.getElementById('pip')
popup.onclick = () => window.open(window.location, 'mozillaWindow', 'popup')
if (window.opener) {
	popup.classList.add('hide')
}
// https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
// https://github.com/WICG/document-picture-in-picture
if ('documentPictureInPicture' in window & !window.opener) {
	// The Document Picture-in-Picture API is supported.
	pip.classList.remove("hide")
	pip.addEventListener("click", () => togglePictureInPicture())
}
async function togglePictureInPicture() {
	// Close Picture-in-Picture window if any
	if (documentPictureInPicture.window) {
		documentPictureInPicture.window.close()
		return
	}
	// Open a Picture-in-Picture window
	const container = document.querySelector("#container")
	const pipWindow = await documentPictureInPicture.requestWindow({
		width: 820,
		height: 380,
		copyStyleSheets: true,
	});
	pipWindow.document.body.append(container)
	// Title and icon
	pipWindow.document.title = "Picture-in-Picture"
	let link = pipWindow.document.createElement('link')
	link.type = 'image/x-icon'
	link.rel = 'shortcut icon'
	link.href = '/img/picture-in-picture-fill.svg'
	pipWindow.document.querySelector('head').appendChild(link)
	// Listen for the PiP closing event to move the container back
	pipWindow.addEventListener("unload", (event) => {
		const body = document.querySelector("body")
		const pipContainer = event.target.querySelector("#container")
		body.append(pipContainer)
	})
}

//* resizer
const left = document.getElementById('input')
const right = document.getElementById('output')
const resizeHandle = document.getElementById('resizer')
let rw
if (localStorage.getItem('resize') !== null) {
	rw = localStorage.getItem('resize')
	left.style.width = 100 - rw + '%'
	right.style.width = rw + '%'
}
let initialiseResize = () => {
	window.addEventListener('mousemove', startResizing, false)
	window.addEventListener('mouseup', stopResizing, false)
}
let startResizing = e => {
	let size = (window.innerWidth - e.clientX ) / window.innerWidth * 100
	if (size > 99.8) size = 100
	if (size < 0.2) size = 0
	rw = size
	left.style.width = 100 - rw + '%'
	right.style.width = rw + '%'
}
let stopResizing = () => {
	window.removeEventListener('mousemove', startResizing, false);
	window.removeEventListener('mouseup', stopResizing, false);
	localStorage.setItem('resize', rw);
}
resizeHandle.addEventListener('mousedown', initialiseResize, false)
resizeHandle.addEventListener('dblclick', () => {
	right.style.width = ''
	left.style.width = ''
	window.localStorage.removeItem('resize')
})

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
	let rawOptions = localStorage.getItem('options')
	let rawOptions2 = localStorage.getItem('options2')
	let options = JSON.parse(rawOptions);
	let options2 = JSON.parse(rawOptions2);
	editor.setOptions(options);
	editor2.setOptions(options2);
}
function customOptions() {
	let settingsMode = document.querySelector('#controls > tr:first-child');
	settingsMode.classList.add('hide')

	let settingsMenu = document.getElementById('controls')
	let settingsMenuBtns = document.querySelectorAll('#controls button')
	settingsMenu.addEventListener('change', saveOptions);
	settingsMenuBtns.forEach((button) => {
		button.addEventListener('click', saveOptions);
	});

	let button = document.createElement('button');
	button.innerHTML = 'Reset Settings';
	button.addEventListener('click', () => {
		resetOptions();
		location.reload();
	});
	settingsMenu.appendChild(button);
}