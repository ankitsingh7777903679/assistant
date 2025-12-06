
function MessageRow(props: { role: string; content: string; index: number }) {
  const { role, content} = props;
  return (
    <>
      <div className={`message-row user ${role === 'user' ? 'user' : 'assistant'} `}>
        <div className={`${role === 'user' ? 'user-bubble ' : 'assistant'}`}>
          {content}
        </div>
      </div>
    </>
  )
}

export default MessageRow