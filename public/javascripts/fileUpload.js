FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);
FilePond.setOptions({
    stylePanelAspectRatio: 15 / 10,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})
FilePond.parse(document.body);