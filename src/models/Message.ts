import mongoose, {Document, Schema} from "mongoose";

export interface IMessage extends Document {
    fromUserId: mongoose.Types.ObjectId,
    toUserId: mongoose.Types.ObjectId,
    encryptedContent: string,
    timestamp: Date,
    read: boolean
}

const MessageSchema = new Schema<IMessage>({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The sending user id is required'],
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The receiving user id is required']
    },
    encryptedContent: {
        type: String,
        required: [true, 'The message is required']
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    read: {
        type: Boolean,
        default: false
    }
})

MessageSchema.index({toUserId: 1, timestamp: -1})
MessageSchema.index({fromUserId: 1, toUserId: 1})

export const Message = mongoose.model<IMessage>('Message', MessageSchema)