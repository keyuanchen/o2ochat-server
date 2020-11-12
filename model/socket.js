module.exports = function (io) {
  const socketList = {}
  // let count = 0
  // 群成员数组
  const users = []
  io.on('connection', socket => {
    console.log('连接成功~')
    socket.on('join', (name, img) => {
      // console.log(name, img)
      socket.name = name
      socketList[name] = socket.id
      // 成员加一
      // count++
      const user = {
        id: socket.id,
        name: name,
        img: img,
        tip: false
      }
      users.push(user)
      // 广播 展示欢迎加入的提示
      socket.broadcast.emit('welcome', name, users)
      socket.emit('self', name, users, socket.id)
    })
    // 接收前端发来的消息，并进行后续处理
    socket.on('sendMsg', data => {
      socket.broadcast.emit('broadcastMsg', data)
    })
    // 一对一聊天
    socket.on('o2oSendMsg', data => {
      // console.log(data)
      socket.to(data.tid).emit('sendO2oMsg', data)
    })
    // 群成员退出群聊天
    socket.on('disconnecting', _ => {
      // 如果加入群聊中有这个用户
      if (socketList.hasOwnProperty(socket.name)) {

        // 删除用户
        delete socketList[socket.name]
        for (let i = 0; i < users.length; i++) {
          if (users[i].name = socket.name) {
            users.splice(i, 1)
          }
        }
        // 通知前端
        socket.broadcast.emit('quit', socket.name, users)
      }
    })
  })
}