const moduleName = 'custom-cursor-icon';
const cursors = ['default', 'default-down', 'grab', 'grab-down', 'pointer', 'pointer-down', 'text', 'text-down'];

Hooks.once("init", () => {
    
    // Register path, x-offset, and y-offset for each type of cursor.
    for (const cursor of cursors) {
        game.settings.register(
            moduleName,
            `${cursor}-path`,
            {
                name: 'File Path',
                scope: 'world',
                config: true,
                requiresReload: true,
                type: String,
                default: '',
                filePicker: 'image',
            });
        game.settings.register(
            moduleName,
            `${cursor}-x`,
            {
                name: 'X Offset',
                scope: 'world',
                config: true,
                requiresReload: true,
                type: Number,
                default: 0,
                range: {
                    min: 0 // no negative values allowed
                },
            });
        game.settings.register(
            moduleName,
            `${cursor}-y`,
            {
                name: 'Y Offset',
                scope: 'world',
                config: true,
                requiresReload: true,
                type: Number,
                default: 0,
                range: {
                    min: 0 // no negative values allowed
                },
            });
    }
    
    // Update cursors with registered settings
    let cursorSettings = {}; // default: {}, "default-down": {},
    
    for (const cursor of cursors) {
        let cursorSetting = {}; // {url: "", x: 0, y: 0}
        for (const settingType of ['path', 'x', 'y']) {
            let key = settingType === 'path' ? 'url' : settingType; // I call this 'path' in my settings, but the key it expects is 'url'.
            cursorSetting[key] = game.settings.get(moduleName, cursor+"-"+settingType);
        }
        cursorSettings[cursor] = cursorSetting;
    }

    Object.assign(CONFIG.cursors, cursorSettings);
});

Hooks.on("renderSettingsConfig", (app, html, data) => {
    document
        .querySelector(`section[data-tab="custom-cursor-icon"]`)
        .insertAdjacentHTML(
            'afterbegin',
            `<fieldset><legend>How To</legend><p class="hint">Cursors are aligned to the top-left of the image at offset (0,0). Adjusting the offset changes where the image is placed relative to the click-point of the cursor. Because the offset can't be negative, you have to create a modified image to pass to the -down variants if you want the cursor to appear to shift downward on click.</p></fieldset>`);

    for (const cursor of cursors) {
        document
            .querySelector(`label[for="settings-config-${moduleName}.${cursor}-path"]`)
            .parentElement.insertAdjacentHTML(
            "beforebegin",
            `<fieldset><legend>` +
            `${cursor.replace(/\b\w+/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())}` +
            `</legend>` +
            `<p class="hint">` +
            `Determine the image file path and offset of the ${cursor} cursor.` +
            `</p>` +
            `</fieldset>`
        );
    }
});