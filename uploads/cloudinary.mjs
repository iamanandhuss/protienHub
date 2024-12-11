import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

dotenv.config()

cloudinary.v2.config({
    cloud_name:'dp5ytzpxg', 
    api_key: '773499734587333', 
    api_secret: 'ttSl7nJKM9xb4rE42Fn0m8LgayI'

})


const storage = new CloudinaryStorage({
    cloudinary:cloudinary.v2,
    params:{
        folder:'product',
        allowed_formats:['jpg', 'png', 'jpeg', 'webp', 'gif']
    }
})

const upload = multer({storage})

export { cloudinary, upload }

