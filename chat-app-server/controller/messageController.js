import Message from "../model/message";
import { io, userSoketMap } from "../server";

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Count number of messages not seen
    const unseenMessages = {};

    await Promise.all(
      filteredUsers.map(async (user) => {
        const messages = await Message.find({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });

        if (messages.length > 0) {
          unseenMessages[user._id] = messages.length;
        }
      })
    );
    await Promise.all(Promise);
    res.status(200).json({
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        // Find all messages between the current user and selected user
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); 

        // Mark messages from the selected user as seen
        await Message.updateMany(
            { 
                senderId: selectedUserId, 
                receiverId: myId,
                seen: false 
            },
            { 
                $set: { seen: true } 
            }
        );

        res.status(200).json({ 
            success: true, 
            messages 
        });

    } catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Internal server error" 
        });
    }
};

// API to mark a specific message as seen using message ID
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Update the message's seen status
         await Message.findByIdAndUpdate(id,{seen: true  });
        res.status(200).json({ success: true,message: "Message marked as seen", 
        });

    } catch (error) {
        console.error("Error in markMessageAsSeen:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;  // Changed from req.user_id to req.user._id

        let imageUrl = null;
        
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create new message in database
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: text || null,  
            image: imageUrl,    
            seen: false       
        });

        //  emit the new mesage to the resived socket
        const receiverSocketId = userSoketMap(receiverId);
        if(receiverId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }


        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });

    } catch (error) {
        console.error('Error in sendMessage:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};