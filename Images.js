define(['altair/facades/declare',
        'liquidfire/modules/apollo/mixins/_HasPropertyTypesMixin',
        'altair/modules/adapters/mixins/_HasAdaptersMixin',
        'altair/plugins/node!path'
], function (declare,
             _HasPropertyTypesMixin,
             _HasAdaptersMixin,
             pathUtil) {

    return declare([_HasPropertyTypesMixin, _HasAdaptersMixin], {

        /**
         * Render a thumbnail using the selected adapter (if one in
         * @param path
         * @param options
         * @param config
         * @returns {*}
         */
        renderThumb: function (path, options, config) {

            var adapter = this.adapter();

            if(!adapter) {
                throw new Error('No image adapter selected (for thumbnail rendering).');
            }

            return adapter.renderThumb(path, options, config);
        },

        resolveThumbnailFilePath: function (file, options) {

            var path = pathUtil.join(this.get('thumbnailDir', null, options), file);

            return path;
        }

    });

});