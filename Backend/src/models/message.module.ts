import { Schema, model, Document, Types} from 'mongoose';

export interface IMessage extends Document {
    sender: Types.ObjectId,
    receiver:Types.ObjectId
    content: String,
}

const messageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    content:{
        type: String,
        required: true,
    }
},{timestamps: true});

const Message = model<IMessage>("Message", messageSchema);

export default Message;