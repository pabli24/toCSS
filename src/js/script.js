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
	animatedScroll: true
}
let editor = ace.edit('editor', setting)
let editor2 = ace.edit('editor2', setting)

ace.require('ace/ext/settings_menu').init(editor)
editor.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(editor) {
		editor.showSettingsMenu()
	},
	readOnly: true
}])
ace.require('ace/ext/settings_menu').init(editor2)
editor2.commands.addCommands([{
	name: 'showSettingsMenu',
	bindKey: {win: 'Ctrl-q', mac: 'Ctrl-q'},
	exec: function(editor2) {
		editor2.showSettingsMenu()
	},
	readOnly: true
}])
const settings = document.getElementById('settings')
settings.onclick = () => editor.showSettingsMenu()
const settings2 = document.getElementById('settings2')
settings2.onclick = () => editor2.showSettingsMenu()

let StatusBar = ace.require('ace/ext/statusbar').StatusBar;
let sb = new StatusBar(editor, document.getElementById('statusBar'))
let sb2 = new StatusBar(editor2, document.getElementById('statusBar2'))

let path = window.location.pathname.split('/')
let params = new URLSearchParams(document.location.search);
let param_code = params.get('code')
let param_c = params.get('c')

if (param_code !== null) {
	editor.session.setValue(param_code)
}
else if (param_c !== null) {
	param_c = LZString.decompressFromEncodedURIComponent(param_c)
	editor.session.setValue(param_c)
}
else if (localStorage.getItem('codeStylus') !== null && path.includes('stylus')) {
	editor.session.setValue(localStorage.getItem('codeStylus'))
}
else if (localStorage.getItem('codeLess') !== null && path.includes('less')) {
	editor.session.setValue(localStorage.getItem('codeLess'))
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

//* lang
if (path.includes('stylus')) {
	editor.session.setMode('ace/mode/stylus', () => {
		AceColorPicker.load(ace, editor)
	})
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
	editor.session.on('change', () => update())
	update()
}
else if (path.includes('less')) {
	editor.session.setMode('ace/mode/less', () => {
		AceColorPicker.load(ace, editor)
	})
	// let version = document.getElementById('version')
	// version.innerHTML = 'Less v' + less.version[0] + '.' + less.version[1] + '.' + less.version[2]
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
//* size
editorL()
editor.session.on('change', () => editorL())
editor2.session.on('change', () => editorL())

//* share
let share = document.getElementById('share')
share.onclick = () => {
	let decodeurl = LZString.compressToEncodedURIComponent(editor.getValue());
	let link = window.location.origin + window.location.pathname + '?c=' + decodeurl
	navigator.clipboard.writeText(link)
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
if (path.includes('less')) {extension = 'less'}

let saveLeft = () => downloadToFile(editor.getValue(), 'style.' + extension, 'text/plain;charset=UTF-8')
document.getElementById('save').addEventListener('click', () => saveLeft())

editor.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveLeft(),
	readOnly: true
}])

let saveCSS = () => downloadToFile(editor2.getValue(), 'style.css', 'text/plain;charset=UTF-8')
document.getElementById('save2').addEventListener('click', () => saveCSS())

editor2.commands.addCommands([{
	name: 'saveFile',
	bindKey: {win: 'Ctrl-s', mac: 'Ctrl-s'},
	exec: () => saveCSS(),
	readOnly: true
}])

//* open in popup
const popup = document.getElementById('popup')
popup.onclick = () => window.open(window.location, 'mozillaWindow', 'popup')
if (window.opener !== null) {
	popup.classList.add('hide')
}
//* resizer
let aceResize = () => {
	editor.resize()
	editor2.resize()
}
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
	aceResize()
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
	aceResize()
	window.localStorage.removeItem('resize')
})
aceResize()