import multer, { diskStorage } from "multer";

export enum UploadType {
    avatar = "avatar",
}

const upload = (uploadType: UploadType) => {
    const fileStorage = diskStorage({
        destination: (_, __, cb) => cb(null, "public/uploads/"),
        filename: (_, file, cb) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);

            if (uploadType === UploadType.avatar) cb(null, `avatar-${unique + ext}`);
        },
    });

    return multer({
        storage: fileStorage,

        fileFilter: (_, file, cb) => {
            if (
                uploadType === UploadType.avatar &&
                (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png")
            )
                cb(null, true);
            else cb(new Error("invalid file type"));
        },
    });
};

export default upload;
