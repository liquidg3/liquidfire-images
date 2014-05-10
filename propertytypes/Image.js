define(['dojo/_base/declare', 'apollo/propertytypes/_Base'],

    function (declare, _Base) {


        return declare([_Base], {


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


            toViewValue: function (value, options, config) {
                return 'we rendered a thumb!!!!';
            },


            /**
             * Not quite sure what to do here yet
             *
             * @param value
             * @param options
             * @param config
             * @returns {*}
             */
            toJsValue: function (value, options, config) {
                return value;
            },

            template: function (options) {
                return 'liquidfire:Images/views/image';
            }

        });

    });
