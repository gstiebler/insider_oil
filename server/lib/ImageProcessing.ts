import * as lwip from 'lwip';

export function resampleImage(image: lwip.Image, width, height): lwip.Batch {
    const imgProp = image.width() / image.height();
    const desiredProp = width / height;
    var resizeWidth, resizeHeight;
    if(imgProp > desiredProp) {
        resizeWidth = height * imgProp;
        resizeHeight = height;
    } else {
        resizeWidth = width;
        resizeHeight = width / imgProp;
    }

    return image.batch()
        .resize(resizeWidth, resizeHeight)
        .crop(width, height);
}

export function resample(buffer: Buffer, width: number, height: number):Promise<Buffer> {
    return new Promise(open);

    function open(resolve, reject) {
        lwip.open(buffer, 'jpg', execute.bind(this, resolve, reject));
    }

    function execute(resolve, reject, err, image: lwip.Image) {
        if(err) {
            reject(err);
            return;
        }

        const batch = resampleImage(image, width, height);
        batch.toBuffer("jpg", {}, save.bind(this, resolve, reject));
    }

    function save(resolve, reject, err, processedBuffer: Buffer) {
        if(err) {
            reject(err);
            return;
        }

        resolve(processedBuffer);
    }
}