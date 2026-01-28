import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minLenght: [3, 'The username must not have less than 3 characters'],
        maxLenght: [30, 'The username must not have more than 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'The password must not have less than 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.index({username: 1})

export const User = mongoose.model<IUser>('User', UserSchema)