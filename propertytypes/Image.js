define(['dojo/_base/declare',
        'liquidfire/modules/files/propertytypes/File',
        'altair/facades/mixin',
        'altair/plugins/node!path',
        'altair/Lifecycle'],

    function (declare,
              File,
              mixin,
              pathUtil,
              Lifecycle) {


        return declare([File, Lifecycle], {


            key:     'image',
            options: {
                w: {
                    type:    'int',
                    options: {
                        'default':   100,
                        label:       'Thumb width',
                        description: 'The default width for thumbnails rendered'
                    }
                },
                h: {
                    type:    'int',
                    options: {
                        'default':   0,
                        label:       'Thumb height',
                        description: 'The height for our thumbnails. 0 means scale proportionality.'
                    }
                }
            },

            startup: function () {

                //so the File propertytype works (we mix it in)
                this.parent = this.nexus('liquidfire:Files');

                return this.inherited(arguments);

            },

            toViewValue: function (value, options, config) {

                return this.nexus('liquidfire:Images').renderThumb(this.nexus('liquidfire:Files').resolveUploadedFilePath(value), options, config).then(function (path) {
                    return '<img src="/' + path.relative + '" />';
                })

            },

            template: function (options) {
                return 'liquidfire:Images/views/image';
            }

        });

    });
