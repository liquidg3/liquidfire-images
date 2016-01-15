define(['altair/facades/declare',
    './_Base',
    'altair/plugins/node!path',
    'altair/plugins/node!fs',
    'altair/plugins/node!mkdirp',
    'apollo/_HasSchemaMixin',
    'altair/Lifecycle'
], function (declare,
             _Base,
             pathUtil,
             fs,
             mkdirp,
             _HasSchemaMixin,
             Lifecycle) {


    var gm;

    return declare([_Base, _HasSchemaMixin, Lifecycle], {

        _mover: null,
        _thumbCache:null,
        _schema: {
            properties: {
                imageMagick: {
                    type: 'boolean',
                    options: {
                        label: 'Use imageMagick',
                        description: 'See help: http://aheckmann.github.io/gm/'
                    }
                }
            }
        },

        startup: function (options) {

            var _options = options || this.options || {};

            this._thumbCache = {};

            return this.inherited(arguments);
        },

        /**
         *
         * @param source
         * @param options
         * @param config
         * @returns {*}
         */
        renderThumb: function (source, options, config) {

            var _options    = options || {},
                w           = _options.w || null,
                h           = _options.h || null,
                dfd,
                suffix      = _options.suffix || '',
                filename    = suffix + 'w' + (w || '') + 'xh' + (h || '') + '-' + pathUtil.basename(source),
                rel         = filename,
                dest        = this.parent.resolveThumbnailFilePath(filename),
                pub         = this.parent.resolveThumbnailFilePath(filename, { absolute: false, public: true });

            if(!dest) {
                throw new Error('liquidfire:Images needs a thumbnailDir. See schema for details.');
            }

            if(this._thumbCache[dest]) {
                return this._thumbCache[dest];
            }


            //setup cache
            dfd = new this.Deferred();
            this._thumbCache[dest] = dfd;

            //check if file exists
            this.promise(fs, 'stat', dest).then(function () {

                dfd.resolve({
                    relative: rel,
                    absolute: dest,
                    public:   pub,
                    filename: pathUtil.basename(dest)
                });

            }.bind(this)).otherwise(function () {

                this.promise(mkdirp, pathUtil.dirname(dest)).then(function () {

                    if (!gm) {

                        require(['altair/plugins/node!gm'], function (_gm) {

                            //optionally use image magick
                            if(this.options && this.options.imageMagick) {
                                gm = _gm.subClass({ imageMagick: true });
                            } else {
                                gm = _gm;
                            }

                        }.bind(this));

                    }
                    //run image operations
                    var i   = gm(source).resize(w,h).autoOrient();

                    return this.promise(i, 'write', dest);

                }.bind(this)).then(function () {

                    return dfd.resolve({
                        relative: rel,
                        absolute: dest,
                        public:   pub,
                        filename: pathUtil.basename(dest)
                    });

                }.bind(this)).otherwise(function (err) {

                    this.err('Failed to render thumb at', source);
                    dfd.reject(err);

                }.bind(this));


            }.bind(this));

            return dfd.promise;

        }

    });

});