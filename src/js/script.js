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

let editorMode = (mode) => {
	editor.session.setMode(mode, () => {
		AceColorPicker.load(ace, editor)
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
if (window.opener) popup.classList.add('hide')
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