define(['altair/facades/declare',
        './_Base',
        'altair/plugins/node!gm',
        'altair/plugins/node!path',
        'altair/plugins/node!fs',
        'altair/plugins/node!mkdirp'

], function (declare,
             _Base,
             gm,
             pathUtil,
             fs,
             mkdirp) {

    return declare([_Base], {

        _mover: null,
        _thumbCache:null,

        constructor: function () {

            this._thumbCache = {};
        },

        /**
         *
         * @param source
         * @param options
         * @param config
         * @returns {*}
         */
        renderThumb: function (source, options, config) {

            var w       = options.w || null,
                h       = options.h || null,
                dfd,
                filename =  'w' + (w || '') + 'xh' + (h || '') + '-' + pathUtil.basename(source),
                rel     = this.parent.resolveThumbnailFilePath(filename, { absolute: false }),
                dest    = this.parent.resolveThumbnailFilePath(filename);

            if(!dest) {
                throw new Error('liquidfire:Images needs a thumbnailDir. See schema for details.');
            }

            if(this._thumbCache[dest]) {
                return this._thumbCache[dest];
            }

            //setup cache
            dfd = new this.Deferred(),
            this._thumbCache[dest] = dfd;

            //check if file exists
            this.promise(fs, 'stat', dest).then(function () {

                dfd.resolve({
                    relative: rel,
                    absolute: dest,
                    filename: pathUtil.basename(dest)
                });

            }.bind(this)).otherwise(function () {

                this.promise(mkdirp, pathUtil.dirname(dest)).then(function () {

                    //run image operations
                    var i   = gm(source).resize(w,h);

                    return this.promise(i, 'write', dest);

                }.bind(this)).then(function () {

                    return dfd.resolve({
                        relative: rel,
                        absolute: dest,
                        filename: pathUtil.basename(dest)
                    });

                }.bind(this)).otherwise(function (err) {

                    dfd.reject(err);

                });


            }.bind(this));

            return dfd;



        }

    });

});