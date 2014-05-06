define(['altair/facades/declare',
    'altair/Lifecycle'
], function (declare,
             Lifecycle) {

    return declare([Lifecycle], {

        startup: function (options) {

            //get options, fallback to default, finally blank obj
            var _options = options || this.options || {};

            return this.inherited(arguments);

        }

    });

});