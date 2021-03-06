# liquidfire:Images
Need thumbs? We got that!

## Step 1 - Configure images module
You need to tell me where to save generated thumbs. It's easy. Start in `modules.json` and add the following block.
```json
{
    "liquidfire:Images": {
        "thumbnailDir": "../thumbnails",
        "publicThumbnailUri": "/thumbnails"
    }
}
```
This will upload files to a `dir` up a level from the `pwd`.

## Step 2a - Generating thumbs via url
Make a request to `/v1/images/thumb?file={{ model.photo.relative }}&w=50&h=0`. Setting `h` or `w` to `0` means "scale proportionally".


## Step 2b - Generate thumb programmatically

```js

this.nexus('liquidfire:Images').renderThumb(path, { w: 100 }).then(function (image) {

    console.log(image);

});

```

## Using ImageMagick
Drop this in your `modules.json`

```json
{
    "liquidfire:Images": {
        "thumbnailDir": "../thumbnails",
        "selectedAdapters" : [
            {
                "path": "liquidfire:Images/adapters/Gm",
                "options": {
                    "imageMagick": true
                }
            }
        ]
    }
}

``